// ==============================================================================
// ISURU SERVICE CENTER POS: CLOUD & LOCAL SYNCHRONIZATION CONTROLLER
// ==============================================================================
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { runSyncCycle, getSyncWorkerStatus } from '../../services/sync-worker.service.js';

/**
 * Atomically apply a single sync operation to a given PostgreSQL database transaction client.
 * Reusable by both HTTP outbox push and direct Neon Cloud synchronization.
 */
export async function applyOperationToDatabase(
  tx: any,
  op: {
    operationId: string;
    entityType: string;
    operationType: string;
    payload: any;
    idempotencyKey?: string;
  },
  deviceId = 'pos-main'
): Promise<string> {
  const { operationId, entityType, operationType, payload, idempotencyKey } = op;
  const opKey = idempotencyKey || operationId;

  if (entityType === 'INVOICE') {
    if (operationType === 'CREATE') {
      const {
        clientTxId,
        billNo: requestedBillNo,
        customerId: inputCustomerId,
        customerName = 'Walk-in Customer',
        customerPhone = '',
        vehicleId: inputVehicleId,
        vehicleNo = 'UNKNOWN',
        vehicleType = 'Others',
        dateTime,
        subtotalAmount = 0,
        discountAmount = 0,
        totalAmount = 0,
        paymentMethod = 'Cash',
        paymentStatus = 'Paid',
        items = [],
      } = payload;

      // Check if invoice already exists
      const existingInvoice = clientTxId
        ? await tx.invoice.findUnique({ where: { clientTxId } })
        : null;

      if (existingInvoice) {
        return `Invoice ${existingInvoice.billNo} already exists`;
      }

      // Resolve Customer
      let customer = inputCustomerId
        ? await tx.customer.findUnique({ where: { id: inputCustomerId } })
        : null;
      if (!customer && customerName) {
        customer = await tx.customer.findFirst({
          where: {
            name: customerName.trim(),
            ...(customerPhone && { phone: customerPhone.trim() }),
          },
        });
        if (!customer) {
          customer = await tx.customer.create({
            data: {
              name: customerName.trim(),
              phone: customerPhone.trim(),
            },
          });
        }
      }

      // Resolve Vehicle
      let vehicle = inputVehicleId
        ? await tx.vehicle.findUnique({ where: { id: inputVehicleId } })
        : null;
      if (!vehicle && customer && vehicleNo) {
        vehicle = await tx.vehicle.findFirst({
          where: {
            customerId: customer.id,
            vehicleNo: vehicleNo.trim().toUpperCase(),
          },
        });
        if (!vehicle) {
          vehicle = await tx.vehicle.create({
            data: {
              customerId: customer.id,
              vehicleNo: vehicleNo.trim().toUpperCase(),
              vehicleType: vehicleType || 'Others',
            },
          });
        }
      }

      // Collision-free Bill Number allocation
      let finalBillNo = requestedBillNo;
      if (!finalBillNo || (await tx.invoice.findUnique({ where: { billNo: finalBillNo } }))) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const prefix = `INV-${dateStr}`;
        let candidateNum = 1;
        finalBillNo = `${prefix}-${String(candidateNum).padStart(4, '0')}`;
        while (await tx.invoice.findUnique({ where: { billNo: finalBillNo } })) {
          candidateNum++;
          finalBillNo = `${prefix}-${String(candidateNum).padStart(4, '0')}`;
        }
      }

      // Deduct stock for line items
      const processedItems: any[] = [];
      for (const rawItem of items) {
        const qty = Math.max(0, Number(rawItem.qty) || 1);
        const rate = Math.max(0, Number(rawItem.rate) || 0);
        const amount = Math.round(qty * rate * 100) / 100;
        const itemId = (rawItem.itemId || '').trim().toUpperCase();
        const description = (rawItem.description || '').trim();
        let buyingPrice = 0;

        if (itemId) {
          let lockedProducts: any[] = await tx.$queryRaw`
            SELECT id, "itemId", quantity, "buyingPrice", "supplierCode"
            FROM products
            WHERE "itemId" = ${itemId}
            FOR UPDATE
          `;

          if (lockedProducts.length === 0) {
            lockedProducts = await tx.$queryRaw`
              SELECT id, "itemId", quantity, "buyingPrice", "supplierCode"
              FROM products
              WHERE UPPER("itemId") LIKE ${'%' + itemId + '%'}
              ORDER BY LENGTH("itemId") ASC
              LIMIT 1
              FOR UPDATE
            `;
          }

          if (lockedProducts.length > 0) {
            const product = lockedProducts[0];
            buyingPrice = Number(product.buyingPrice) || 0;

            await tx.product.update({
              where: { id: product.id },
              data: { quantity: { decrement: qty } },
            });

            await tx.stockMovement.create({
              data: {
                itemId: product.itemId,
                supplierCode: product.supplierCode || '',
                quantity: -qty,
                unitPrice: rate,
                buyingPrice,
                paymentMethod,
                movedAt: dateTime ? new Date(dateTime) : new Date(),
              },
            });
          }
        }

        processedItems.push({
          service: rawItem.service || description || 'Service / Labour',
          itemId,
          description,
          qty,
          rate,
          amount,
          buyingPrice,
        });
      }

      // Create invoice
      await tx.invoice.create({
        data: {
          clientTxId: clientTxId || opKey,
          billNo: finalBillNo,
          isProvisional: false,
          syncedAt: new Date(),
          customerId: customer?.id,
          customerName: (customerName || 'Walk-in').trim(),
          customerPhone: (customerPhone || '').trim(),
          vehicleId: vehicle?.id,
          vehicleNo: (vehicleNo || 'UNKNOWN').trim().toUpperCase(),
          vehicleType,
          dateTime: dateTime ? new Date(dateTime) : new Date(),
          subtotalAmount: Number(subtotalAmount) || 0,
          discountAmount: Number(discountAmount) || 0,
          totalAmount: Number(totalAmount) || 0,
          paymentMethod,
          paymentStatus,
          items: {
            create: processedItems,
          },
        },
      });

      return `Invoice ${finalBillNo} synced successfully.`;
    } else if (operationType === 'UPDATE') {
      const { id, paymentStatus, paymentSettledAt } = payload;
      if (id) {
        await tx.invoice.update({
          where: { id },
          data: {
            paymentStatus,
            paymentSettledAt: paymentSettledAt ? new Date(paymentSettledAt) : new Date(),
          },
        });
        return `Invoice ${id} settlement updated.`;
      }
    } else if (operationType === 'DELETE') {
      const { id } = payload;
      if (id) {
        await tx.invoice.deleteMany({ where: { id } });
        return `Invoice ${id} deleted.`;
      }
    }
  } else if (entityType === 'CUSTOMER') {
    const { name, phone = '', nic = '', bankDetails = '' } = payload;
    if (name) {
      const cleanPhone = phone.trim();
      let cust = cleanPhone ? await tx.customer.findFirst({ where: { phone: cleanPhone } }) : null;
      if (cust) {
        await tx.customer.update({
          where: { id: cust.id },
          data: { name: name.trim(), nic: nic.trim(), bankDetails: bankDetails.trim() },
        });
      } else {
        await tx.customer.create({
          data: { name: name.trim(), phone: cleanPhone, nic: nic.trim(), bankDetails: bankDetails.trim() },
        });
      }
      return `Customer ${name} synced.`;
    }
  } else if (entityType === 'PRODUCT') {
    const { itemId, itemName, brand = '', quantity = 0, unitPrice = 0, buyingPrice = 0, supplierCode = '', paymentMethod = 'Cash' } = payload;
    if (itemId) {
      await tx.product.upsert({
        where: { itemId: itemId.trim().toUpperCase() },
        update: { itemName, brand, quantity: Number(quantity), unitPrice, buyingPrice, supplierCode, paymentMethod },
        create: { itemId: itemId.trim().toUpperCase(), itemName, brand, quantity: Number(quantity), unitPrice, buyingPrice, supplierCode, paymentMethod },
      });
      return `Product ${itemId} synced.`;
    }
  } else if (entityType === 'SERVICE') {
    const { category = 'Others', name, price = 0, description = '' } = payload;
    if (name) {
      const existing = await tx.service.findFirst({ where: { category, name } });
      if (existing) {
        await tx.service.update({ where: { id: existing.id }, data: { price, description } });
      } else {
        await tx.service.create({ data: { category, name, price, description } });
      }
      return `Service ${category} / ${name} synced.`;
    }
  } else if (entityType === 'SETTING') {
    const { key, value } = payload;
    if (key && value !== undefined) {
      await tx.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      return `Setting ${key} synced.`;
    }
  } else if (entityType === 'SUPPLIER') {
    const { supplierCode, name, contact = '', invoice = '' } = payload;
    if (supplierCode) {
      await tx.supplier.upsert({
        where: { supplierCode },
        update: { name, contact, invoice },
        create: { supplierCode, name, contact, invoice },
      });
      return `Supplier ${supplierCode} synced.`;
    }
  } else if (entityType === 'SUPPLY_INVOICE') {
    const { invoiceNo, supplierCode, itemId, buyingPrice = 0, quantity = 0, paymentStatus = 'Cash' } = payload;
    if (invoiceNo && supplierCode && itemId) {
      await tx.supplyInvoice.create({
        data: {
          invoiceNo,
          supplierCode,
          itemId,
          buyingPrice,
          quantity,
          paymentStatus,
        },
      });
      return `Supply Invoice ${invoiceNo} synced.`;
    }
  }

  return `Operation ${entityType}:${operationType} accepted.`;
}

/**
 * Handle batch push of outbox operations from local POS to cloud database.
 * Completely idempotent: duplicate operationIds / idempotencyKeys return existing acks.
 */
export async function pushOutbox(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { deviceId = 'pos-main', operations = [] } = req.body;

    if (!Array.isArray(operations)) {
      res.status(400).json({ success: false, error: 'operations must be an array.' });
      return;
    }

    const results: Array<{
      operationId: string;
      status: 'SYNCED' | 'CONFLICT' | 'FAILED';
      serverAcknowledgement?: string;
      error?: string;
    }> = [];

    for (const op of operations) {
      const { operationId, entityType, operationType, payload, idempotencyKey } = op;
      const opKey = idempotencyKey || operationId;

      try {
        // 1. Idempotency Check via sync_operations table
        const existingOp = await prisma.syncOperation.findUnique({
          where: { clientOpId: opKey },
        });

        if (existingOp && existingOp.status === 'APPLIED') {
          results.push({
            operationId,
            status: 'SYNCED',
            serverAcknowledgement: `Already Processed: ${existingOp.response || 'OK'}`,
          });
          continue;
        }

        // 2. Process entity operation atomically
        const ack = await prisma.$transaction(async (tx) => {
          return await applyOperationToDatabase(tx, op, deviceId);
        });

        // Record audit entry in sync_operations
        await prisma.syncOperation.upsert({
          where: { clientOpId: opKey },
          update: { status: 'APPLIED', appliedAt: new Date(), response: ack },
          create: {
            clientOpId: opKey,
            deviceId,
            operationType: `${entityType}_${operationType}`,
            status: 'APPLIED',
            payload: JSON.stringify(payload),
            response: ack,
            appliedAt: new Date(),
          },
        });

        results.push({
          operationId,
          status: 'SYNCED',
          serverAcknowledgement: ack,
        });
      } catch (opError: any) {
        results.push({
          operationId,
          status: 'FAILED',
          error: opError.message,
        });
      }
    }

    res.json({
      success: true,
      processedCount: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Two-way incremental pull: Returns remote catalog updates modified after given timestamp.
 */
export async function pullChanges(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sinceStr = req.query.since as string;
    const since = sinceStr ? new Date(sinceStr) : new Date(0);

    const [products, services, settings] = await Promise.all([
      prisma.product.findMany({
        where: { updatedAt: { gt: since } },
        orderBy: { updatedAt: 'asc' },
        take: 200,
      }),
      prisma.service.findMany({
        where: { updatedAt: { gt: since } },
        orderBy: { updatedAt: 'asc' },
        take: 200,
      }),
      prisma.setting.findMany({
        where: { updatedAt: { gt: since } },
      }),
    ]);

    res.json({
      success: true,
      serverTime: new Date().toISOString(),
      products: products.map((p) => ({
        ...p,
        unitPrice: Number(p.unitPrice),
        buyingPrice: Number(p.buyingPrice),
      })),
      services: services.map((s) => ({
        ...s,
        price: Number(s.price),
      })),
      settings,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Trigger an immediate synchronization push and pull cycle.
 */
export async function triggerSync(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cycleResult = await runSyncCycle();
    res.json({
      success: true,
      message: cycleResult.isOnline ? 'Sync cycle completed.' : 'Sync completed in offline mode.',
      ...cycleResult,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Return operational metrics and synchronization worker status.
 */
export async function getSyncStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const workerStatus = await getSyncWorkerStatus();
    const totalOps = await prisma.syncOperation.count();
    const totalSynced = await prisma.syncOperation.count({ where: { status: 'APPLIED' } });
    const totalConflicts = await prisma.syncOperation.count({ where: { status: 'CONFLICT' } });

    res.json({
      success: true,
      status: 'healthy',
      serverTime: new Date().toISOString(),
      totalSynced,
      totalConflicts,
      worker: workerStatus,
      totalAuditOperations: totalOps,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Direct invoice synchronization endpoint for backward compatibility with frontend PWA client.
 */
export async function syncInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      clientTxId,
      provisionalBillNo,
      customerName,
      customerPhone = '',
      vehicleNo,
      vehicleType = 'Others',
      dateTime,
      subtotalAmount = 0,
      discountAmount = 0,
      totalAmount = 0,
      paymentMethod = 'Cash',
      paymentStatus = 'Paid',
      items = [],
    } = req.body;

    if (!clientTxId || typeof clientTxId !== 'string') {
      res.status(400).json({ success: false, error: 'clientTxId is required for idempotent synchronization.' });
      return;
    }

    if (!customerName || !vehicleNo) {
      res.status(400).json({ success: false, error: 'Customer name and vehicle number are required.' });
      return;
    }

    // 1. Idempotency Check: Return existing record if already synchronized
    const existing = await prisma.invoice.findUnique({
      where: { clientTxId },
      include: { items: true },
    });

    if (existing) {
      res.json({
        success: true,
        isDuplicate: true,
        message: `Invoice ${existing.billNo} was already synchronized.`,
        invoice: {
          ...existing,
          subtotalAmount: Number(existing.subtotalAmount),
          discountAmount: Number(existing.discountAmount),
          totalAmount: Number(existing.totalAmount),
          items: existing.items.map((it) => ({
            ...it,
            rate: Number(it.rate),
            amount: Number(it.amount),
            buyingPrice: Number(it.buyingPrice),
          })),
        },
      });
      return;
    }

    // 2. Wrap creation inside atomic transaction
    const now = new Date();
    const result = await prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findFirst({
        where: {
          name: customerName.trim(),
          ...(customerPhone && { phone: customerPhone.trim() }),
        },
      });
      if (!customer) {
        customer = await tx.customer.create({
          data: { name: customerName.trim(), phone: customerPhone.trim() },
        });
      }

      let vehicle = await tx.vehicle.findFirst({
        where: { customerId: customer.id, vehicleNo: vehicleNo.trim().toUpperCase() },
      });
      if (!vehicle) {
        vehicle = await tx.vehicle.create({
          data: {
            customerId: customer.id,
            vehicleNo: vehicleNo.trim().toUpperCase(),
            vehicleType: vehicleType || 'Others',
          },
        });
      }

      // Allocate unique Bill Number
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const prefix = `INV-${dateStr}`;
      const existingPrefixBills = await tx.invoice.findMany({
        where: { billNo: { startsWith: `${prefix}-` } },
        select: { billNo: true },
      });

      let maxNum = 0;
      for (const inv of existingPrefixBills) {
        const parts = inv.billNo.split('-');
        if (parts.length === 3) {
          const num = parseInt(parts[2], 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      }

      let candidateNum = maxNum + 1;
      let finalBillNo = `${prefix}-${String(candidateNum).padStart(4, '0')}`;
      while (await tx.invoice.findUnique({ where: { billNo: finalBillNo } })) {
        candidateNum++;
        finalBillNo = `${prefix}-${String(candidateNum).padStart(4, '0')}`;
      }

      const processedItems: any[] = [];
      const stockConflicts: string[] = [];

      for (const rawItem of items) {
        const qty = Math.max(0, Number(rawItem.qty) || 1);
        const rate = Math.max(0, Number(rawItem.rate) || 0);
        const amount = Math.round(qty * rate * 100) / 100;
        const itemId = (rawItem.itemId || '').trim().toUpperCase();
        const description = (rawItem.description || '').trim();
        let buyingPrice = 0;

        if (itemId) {
          let lockedProducts: any[] = await tx.$queryRaw`
            SELECT id, "itemId", quantity, "buyingPrice", "supplierCode"
            FROM products
            WHERE "itemId" = ${itemId}
            FOR UPDATE
          `;

          if (lockedProducts.length === 0) {
            lockedProducts = await tx.$queryRaw`
              SELECT id, "itemId", quantity, "buyingPrice", "supplierCode"
              FROM products
              WHERE UPPER("itemId") LIKE ${'%' + itemId + '%'}
              ORDER BY LENGTH("itemId") ASC
              LIMIT 1
              FOR UPDATE
            `;
          }

          if (lockedProducts.length > 0) {
            const product = lockedProducts[0];
            const availableQty = Number(product.quantity);
            buyingPrice = Number(product.buyingPrice) || 0;

            if (availableQty < qty) {
              stockConflicts.push(
                `Part "${product.itemId}": offline sold ${qty}, but current stock was ${availableQty}. Adjusted.`
              );
            }

            await tx.product.update({
              where: { id: product.id },
              data: { quantity: { decrement: qty } },
            });

            await tx.stockMovement.create({
              data: {
                itemId: product.itemId,
                supplierCode: product.supplierCode || '',
                quantity: -qty,
                unitPrice: rate,
                buyingPrice,
                paymentMethod,
                movedAt: dateTime ? new Date(dateTime) : now,
              },
            });
          }
        }

        processedItems.push({
          service: rawItem.service || description || 'Service / Labour',
          itemId,
          description,
          qty,
          rate,
          amount,
          buyingPrice,
        });
      }

      const createdInvoice = await tx.invoice.create({
        data: {
          clientTxId,
          billNo: finalBillNo,
          isProvisional: false,
          syncedAt: now,
          customerId: customer.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          vehicleId: vehicle.id,
          vehicleNo: vehicleNo.trim().toUpperCase(),
          vehicleType,
          dateTime: dateTime ? new Date(dateTime) : now,
          subtotalAmount: Number(subtotalAmount) || 0,
          discountAmount: Number(discountAmount) || 0,
          totalAmount: Number(totalAmount) || 0,
          paymentMethod,
          paymentStatus,
          items: { create: processedItems },
        },
        include: { items: true },
      });

      await tx.syncOperation.upsert({
        where: { clientOpId: clientTxId },
        update: {
          status: stockConflicts.length > 0 ? 'CONFLICT' : 'APPLIED',
          response: JSON.stringify({ billNo: finalBillNo, provisionalBillNo }),
          errorMessage: stockConflicts.length > 0 ? stockConflicts.join('; ') : null,
          appliedAt: now,
        },
        create: {
          clientOpId: clientTxId,
          deviceId: (req.headers['x-device-id'] as string) || 'pos-main',
          operationType: 'CREATE_INVOICE',
          status: stockConflicts.length > 0 ? 'CONFLICT' : 'APPLIED',
          payload: JSON.stringify(req.body),
          response: JSON.stringify({ billNo: finalBillNo, provisionalBillNo }),
          errorMessage: stockConflicts.length > 0 ? stockConflicts.join('; ') : null,
          appliedAt: now,
        },
      });

      return { invoice: createdInvoice, conflicts: stockConflicts };
    });

    res.status(201).json({
      success: true,
      message: `Invoice ${result.invoice.billNo} synchronized successfully.`,
      provisionalBillNo,
      finalBillNo: result.invoice.billNo,
      conflicts: result.conflicts,
      invoice: {
        ...result.invoice,
        subtotalAmount: Number(result.invoice.subtotalAmount),
        discountAmount: Number(result.invoice.discountAmount),
        totalAmount: Number(result.invoice.totalAmount),
        items: result.invoice.items.map((it) => ({
          ...it,
          rate: Number(it.rate),
          amount: Number(it.amount),
          buyingPrice: Number(it.buyingPrice),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}
