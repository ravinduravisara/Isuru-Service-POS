// ==============================================================================
// ISURU SERVICE CENTER POS: IDEMPOTENT OFFLINE SYNCHRONIZATION CONTROLLER
// ==============================================================================
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function syncInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      clientTxId,
      provisionalBillNo,
      customerId,
      customerName,
      customerPhone = '',
      vehicleId,
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

    const now = new Date();
    const invoiceDate = dateTime ? new Date(dateTime) : now;

    // 2. Atomic Transaction: allocate final BillNo, deduct stock with row lock, and create records
    const result = await prisma.$transaction(async (tx) => {
      // Allocate next standard sequential Bill Number (INV-YYYYMMDD-XXXX)
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const prefix = `INV-${dateStr}`;

      const lastInvoice = await tx.invoice.findFirst({
        where: { billNo: { startsWith: prefix } },
        orderBy: { billNo: 'desc' },
      });

      let nextNum = 1;
      if (lastInvoice && lastInvoice.billNo) {
        const parts = lastInvoice.billNo.split('-');
        if (parts.length === 3 && !isNaN(parseInt(parts[2], 10))) {
          nextNum = parseInt(parts[2], 10) + 1;
        }
      }
      const finalBillNo = `${prefix}-${String(nextNum).padStart(4, '0')}`;

      // Process and lock items for stock deduction
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
          // Lock product row to serialize stock movements
          let lockedProducts: any[] = await tx.$queryRaw`
            SELECT id, "itemId", quantity, "buyingPrice", "supplierCode"
            FROM products
            WHERE "itemId" = ${itemId}
            FOR UPDATE
          `;

          // Fallback to match dual-code parts (e.g. "LR004459" matching "EO-24070 / LR004459")
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

            // Deduct stock conditionally
            await tx.product.update({
              where: { id: product.id },
              data: {
                quantity: { decrement: qty },
              },
            });

            // Create auditable stock movement record
            await tx.stockMovement.create({
              data: {
                itemId: product.itemId,
                supplierCode: product.supplierCode || '',
                quantity: -qty,
                unitPrice: rate,
                buyingPrice,
                paymentMethod,
                movedAt: invoiceDate,
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

      // Create finalized Invoice
      const createdInvoice = await tx.invoice.create({
        data: {
          clientTxId,
          billNo: finalBillNo,
          isProvisional: false,
          syncedAt: now,
          customerId: customerId || undefined,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          vehicleId: vehicleId || undefined,
          vehicleNo: vehicleNo.trim().toUpperCase(),
          vehicleType,
          dateTime: invoiceDate,
          subtotalAmount: Number(subtotalAmount) || 0,
          discountAmount: Number(discountAmount) || 0,
          totalAmount: Number(totalAmount) || 0,
          paymentMethod,
          paymentStatus,
          paymentSettledAt: paymentStatus === 'Paid' ? invoiceDate : null,
          items: {
            create: processedItems,
          },
        },
        include: { items: true },
      });

      // Record SyncOperation for idempotency audit log
      await tx.syncOperation.create({
        data: {
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

      return {
        invoice: createdInvoice,
        conflicts: stockConflicts,
      };
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

export async function getSyncStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const totalSynced = await prisma.syncOperation.count({ where: { status: 'APPLIED' } });
    const totalConflicts = await prisma.syncOperation.count({ where: { status: 'CONFLICT' } });

    res.json({
      success: true,
      status: 'healthy',
      serverTime: new Date().toISOString(),
      totalSynced,
      totalConflicts,
    });
  } catch (error) {
    next(error);
  }
}
