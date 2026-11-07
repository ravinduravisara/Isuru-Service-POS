import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function createInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      customerId: inputCustomerId,
      customerName,
      customerPhone = '',
      vehicleId: inputVehicleId,
      vehicleNo,
      vehicleType = 'Others',
      items,
      discount = 0,
      paymentMethod = 'Cash',
      billNo: customBillNo,
    } = req.body;

    if (!customerName || !customerName.trim()) {
      res.status(400).json({ success: false, error: 'Customer name is required.' });
      return;
    }
    if (!vehicleNo || !vehicleNo.trim()) {
      res.status(400).json({ success: false, error: 'Vehicle number is required.' });
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'At least one invoice item is required.' });
      return;
    }

    const cleanCustName = customerName.trim();
    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    const cleanVehNo = vehicleNo.trim().toUpperCase();
    const now = new Date();

    const createdInvoice = await prisma.$transaction(async (tx) => {
      // 1. Resolve or Create Customer
      let customer = null;
      if (inputCustomerId) {
        customer = await tx.customer.findUnique({ where: { id: inputCustomerId } });
      }
      if (!customer) {
        customer = await tx.customer.findFirst({
          where: {
            name: cleanCustName,
            ...(cleanPhone && { phone: cleanPhone }),
          },
        });
        if (!customer) {
          customer = await tx.customer.create({
            data: {
              name: cleanCustName,
              phone: cleanPhone,
            },
          });
        }
      }

      // 2. Resolve or Create Vehicle
      let vehicle = null;
      if (inputVehicleId) {
        vehicle = await tx.vehicle.findUnique({ where: { id: inputVehicleId } });
      }
      if (!vehicle) {
        vehicle = await tx.vehicle.findFirst({
          where: {
            customerId: customer.id,
            vehicleNo: cleanVehNo,
          },
        });
        if (!vehicle) {
          vehicle = await tx.vehicle.create({
            data: {
              customerId: customer.id,
              vehicleNo: cleanVehNo,
              vehicleType: vehicleType || 'Others',
            },
          });
        }
      }

      // 3. Process Line Items and Real-time Stock Deduction
      const processedItems: Array<{
        service: string;
        itemId: string;
        description: string;
        qty: number;
        rate: number;
        amount: number;
        buyingPrice: number;
      }> = [];

      let subtotal = 0;

      for (const rawItem of items) {
        const service = (rawItem.service || '').trim();
        if (!service) continue;

        const qty = Math.max(0, Number(rawItem.qty) || 1);
        const rate = Math.max(0, Number(rawItem.rate) || 0);
        const amount = Math.round(qty * rate * 100) / 100;
        const itemId = (rawItem.itemId || '').trim().toUpperCase();
        const description = (rawItem.description || '').trim();

        let buyingPrice = 0;

        if (itemId) {
          // Row lock product in PostgreSQL to serialize concurrent transactions and prevent race conditions
          const lockedProducts: any[] = await tx.$queryRaw`
            SELECT id, "itemId", quantity, "buyingPrice", "supplierCode"
            FROM products
            WHERE "itemId" = ${itemId}
            FOR UPDATE
          `;

          if (lockedProducts.length > 0) {
            const product = lockedProducts[0];
            const availableQty = Number(product.quantity);
            buyingPrice = Number(product.buyingPrice) || 0;

            // Strict stock check: prevent overselling when negative stock is not permitted
            if (availableQty < qty) {
              throw new Error(
                `Insufficient stock for item "${itemId}". Requested: ${qty}, Available: ${availableQty}.`
              );
            }

            // Atomic conditional decrement in PostgreSQL
            const deduction = await tx.product.updateMany({
              where: {
                id: product.id,
                quantity: { gte: qty },
              },
              data: {
                quantity: { decrement: qty },
              },
            });

            if (deduction.count === 0) {
              throw new Error(
                `Concurrent transaction conflict: Unable to allocate ${qty} units of "${itemId}". Please retry.`
              );
            }

            // Record stock movement (negative for sale)
            await tx.stockMovement.create({
              data: {
                itemId,
                supplierCode: product.supplierCode || '',
                quantity: -qty,
                unitPrice: rate,
                buyingPrice,
                paymentMethod,
                movedAt: now,
              },
            });
          }
        }

        subtotal += amount;
        processedItems.push({
          service,
          itemId,
          description,
          qty,
          rate,
          amount,
          buyingPrice,
        });
      }

      if (processedItems.length === 0) {
        throw new Error('Please add at least one valid invoice row with an amount.');
      }

      subtotal = Math.round(subtotal * 100) / 100;
      const discountNum = Math.min(subtotal, Math.max(0, Number(discount) || 0));
      const totalAmount = Math.max(0, Math.round((subtotal - discountNum) * 100) / 100);

      // 4. Generate unique bill number
      let billNo = customBillNo?.trim();
      if (!billNo) {
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const timestamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
        billNo = `INV-${timestamp}`;
      }

      // Check for billNo collision and make unique if needed
      let uniqueBillNo = billNo;
      let counter = 1;
      while (await tx.invoice.findUnique({ where: { billNo: uniqueBillNo } })) {
        uniqueBillNo = `${billNo}-${counter}`;
        counter++;
      }

      // 5. Payment Status
      let paymentStatus: string = 'Paid';
      if (paymentMethod.toLowerCase() === 'credit') {
        paymentStatus = 'unpaid';
      } else if (paymentMethod.toLowerCase() === 'cheque') {
        paymentStatus = 'Pending';
      }

      // 6. Create Invoice with Items
      const invoice = await tx.invoice.create({
        data: {
          billNo: uniqueBillNo,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          vehicleId: vehicle.id,
          vehicleNo: vehicle.vehicleNo,
          vehicleType: vehicle.vehicleType,
          dateTime: now,
          subtotalAmount: subtotal,
          discountAmount: discountNum,
          totalAmount,
          paymentMethod,
          paymentStatus,
          items: {
            create: processedItems.map((item) => ({
              service: item.service,
              itemId: item.itemId,
              description: item.description,
              qty: item.qty,
              rate: item.rate,
              amount: item.amount,
              buyingPrice: item.buyingPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return invoice;
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully.',
      invoice: {
        id: createdInvoice.id,
        _id: createdInvoice.id,
        billNo: createdInvoice.billNo,
        dateTime: createdInvoice.dateTime,
        customerName: createdInvoice.customerName,
        customerPhone: createdInvoice.customerPhone,
        vehicleNo: createdInvoice.vehicleNo,
        vehicleType: createdInvoice.vehicleType,
        subtotalAmount: Number(createdInvoice.subtotalAmount),
        discountAmount: Number(createdInvoice.discountAmount),
        totalAmount: Number(createdInvoice.totalAmount),
        paymentMethod: createdInvoice.paymentMethod,
        paymentStatus: createdInvoice.paymentStatus,
        items: createdInvoice.items.map((it) => ({
          service: it.service,
          itemId: it.itemId,
          description: it.description,
          qty: it.qty,
          rate: Number(it.rate),
          amount: Number(it.amount),
          buyingPrice: Number(it.buyingPrice),
        })),
      },
    });
  } catch (error: any) {
    if (
      error.message?.includes('Please add at least one valid invoice row') ||
      error.message?.includes('Insufficient stock') ||
      error.message?.includes('Concurrent transaction conflict')
    ) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
}

export async function getInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';
    const paymentMethod = (req.query.paymentMethod as string)?.trim() || '';
    const creditorsOnly = req.query.creditorsOnly === 'true';
    const fromStr = req.query.from as string;
    const toStr = req.query.to as string;

    const where: any = {};

    // Date range
    if (fromStr || toStr) {
      where.dateTime = {};
      if (fromStr) {
        const fromDate = new Date(fromStr);
        fromDate.setHours(0, 0, 0, 0);
        where.dateTime.gte = fromDate;
      }
      if (toStr) {
        const toDate = new Date(toStr);
        toDate.setHours(23, 59, 59, 999);
        where.dateTime.lte = toDate;
      }
    }

    if (search) {
      where.OR = [
        { billNo: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { vehicleNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (paymentMethod && paymentMethod !== 'All') {
      where.paymentMethod = { equals: paymentMethod, mode: 'insensitive' };
    }

    if (creditorsOnly) {
      where.paymentMethod = { equals: 'Credit', mode: 'insensitive' };
      where.paymentStatus = { not: 'Paid' };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: [{ dateTime: 'desc' }, { id: 'desc' }],
    });

    let cashTotal = 0;
    let chequeTotal = 0;
    let creditTotal = 0;
    let grandTotal = 0;

    const formatted = invoices.map((inv) => {
      const totalAmount = Number(inv.totalAmount);
      grandTotal += totalAmount;
      const pm = inv.paymentMethod.toLowerCase();
      if (pm === 'cash' || pm === 'card') {
        cashTotal += totalAmount;
      } else if (pm === 'cheque') {
        chequeTotal += totalAmount;
      } else if (pm === 'credit') {
        creditTotal += totalAmount;
      }

      return {
        id: inv.id,
        _id: inv.id,
        billNo: inv.billNo,
        customerName: inv.customerName,
        customerPhone: inv.customerPhone,
        vehicleNo: inv.vehicleNo,
        vehicleType: inv.vehicleType,
        dateTime: inv.dateTime,
        subtotalAmount: Number(inv.subtotalAmount),
        discountAmount: Number(inv.discountAmount),
        totalAmount,
        paymentMethod: inv.paymentMethod,
        paymentStatus: inv.paymentStatus,
        paymentSettledAt: inv.paymentSettledAt,
        itemsCount: inv._count.items,
      };
    });

    res.json({
      success: true,
      invoices: formatted,
      summary: {
        totalInvoices: invoices.length,
        grandTotal: Math.round(grandTotal * 100) / 100,
        cashTotal: Math.round(cashTotal * 100) / 100,
        chequeTotal: Math.round(chequeTotal * 100) / 100,
        creditTotal: Math.round(creditTotal * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const paramId = Array.isArray(id) ? id[0] : id;

    if (!paramId) {
      res.status(404).json({ success: false, error: 'Invoice not found.' });
      return;
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ id: paramId }, { billNo: paramId }],
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found.' });
      return;
    }

    res.json({
      success: true,
      invoice: {
        id: invoice.id,
        _id: invoice.id,
        billNo: invoice.billNo,
        dateTime: invoice.dateTime,
        customerName: invoice.customerName,
        customerPhone: invoice.customerPhone,
        vehicleNo: invoice.vehicleNo,
        vehicleType: invoice.vehicleType,
        subtotalAmount: Number(invoice.subtotalAmount),
        discountAmount: Number(invoice.discountAmount),
        totalAmount: Number(invoice.totalAmount),
        paymentMethod: invoice.paymentMethod,
        paymentStatus: invoice.paymentStatus,
        paymentSettledAt: invoice.paymentSettledAt,
        items: invoice.items.map((it) => ({
          service: it.service,
          itemId: it.itemId,
          description: it.description,
          qty: it.qty,
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

export async function settleInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { invoiceIds } = req.body;
    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      res.status(400).json({ success: false, error: 'Array of invoice IDs is required.' });
      return;
    }

    const now = new Date();
    await prisma.invoice.updateMany({
      where: {
        id: { in: invoiceIds },
        paymentMethod: { equals: 'Credit', mode: 'insensitive' },
        paymentStatus: { not: 'Paid' },
      },
      data: {
        paymentStatus: 'Paid',
        paymentSettledAt: now,
      },
    });

    res.json({
      success: true,
      message: `${invoiceIds.length} credit invoice(s) marked as settled.`,
    });
  } catch (error) {
    next(error);
  }
}

export async function settleInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const now = new Date();

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        paymentStatus: 'Paid',
        paymentSettledAt: now,
      },
    });

    res.json({
      success: true,
      message: `Invoice ${invoice.billNo} marked as settled.`,
      invoice: {
        ...invoice,
        subtotalAmount: Number(invoice.subtotalAmount),
        discountAmount: Number(invoice.discountAmount),
        totalAmount: Number(invoice.totalAmount),
      },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Invoice not found.' });
      return;
    }
    next(error);
  }
}

export async function deleteInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const deleted = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!invoice) {
        return null;
      }

      // Restore stock for inventory items sold on this invoice
      for (const item of invoice.items) {
        if (item.itemId) {
          await tx.product.updateMany({
            where: { itemId: item.itemId.trim().toUpperCase() },
            data: {
              quantity: { increment: item.qty },
            },
          });
        }
      }

      await tx.invoice.delete({
        where: { id },
      });

      return invoice;
    });

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Invoice not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Invoice ${deleted.billNo} deleted and inventory quantities restored.`,
    });
  } catch (error) {
    next(error);
  }
}
