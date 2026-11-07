import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function getSupplyInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';
    const paymentStatus = (req.query.paymentStatus as string)?.trim() || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { invoiceNo: { contains: search, mode: 'insensitive' } },
        { supplierCode: { contains: search, mode: 'insensitive' } },
        { itemId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (paymentStatus && paymentStatus !== 'All') {
      where.paymentStatus = { equals: paymentStatus, mode: 'insensitive' };
    }

    const invoices = await prisma.supplyInvoice.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    let totalAmount = 0;
    let cashTotal = 0;
    let creditTotal = 0;
    let chequeTotal = 0;

    const formatted = invoices.map((inv) => {
      const buyingPrice = Number(inv.buyingPrice);
      const lineTotal = inv.quantity * buyingPrice;
      totalAmount += lineTotal;
      if (inv.paymentStatus.toLowerCase() === 'credit') creditTotal += lineTotal;
      else if (inv.paymentStatus.toLowerCase() === 'cheque') chequeTotal += lineTotal;
      else cashTotal += lineTotal;

      return {
        id: inv.id,
        _id: inv.id,
        invoiceNo: inv.invoiceNo,
        supplierCode: inv.supplierCode,
        itemId: inv.itemId,
        buyingPrice,
        quantity: inv.quantity,
        total: lineTotal,
        paymentStatus: inv.paymentStatus,
        chequeNo: inv.chequeNo || '',
        branchCode: inv.branchCode || '',
        bankCode: inv.bankCode || '',
        valueDate: inv.valueDate,
        settledAt: inv.settledAt,
        isSettled: Boolean(inv.settledAt),
        createdAt: inv.createdAt,
      };
    });

    res.json({
      success: true,
      invoices: formatted,
      summary: {
        totalAmount: Math.round(totalAmount * 100) / 100,
        cashTotal: Math.round(cashTotal * 100) / 100,
        creditTotal: Math.round(creditTotal * 100) / 100,
        chequeTotal: Math.round(chequeTotal * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createSupplyInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      invoiceNo,
      supplierCode,
      itemId,
      buyingPrice,
      quantity,
      paymentStatus = 'Cash',
      chequeNo = '',
      branchCode = '',
      bankCode = '',
      valueDate = null,
    } = req.body;

    if (!invoiceNo || !supplierCode || !itemId) {
      res.status(400).json({ success: false, error: 'Invoice No, Supplier Code, and Item ID are required.' });
      return;
    }

    const bPrice = Math.max(0, Number(buyingPrice) || 0);
    const qty = Math.max(0, Number(quantity) || 0);
    if (qty <= 0) {
      res.status(400).json({ success: false, error: 'Quantity must be greater than zero.' });
      return;
    }

    const cleanItemId = itemId.trim().toUpperCase();
    const supCode = supplierCode.trim().toUpperCase();
    const pStatus = paymentStatus === 'Credit' || paymentStatus === 'Cheque' ? paymentStatus : 'Cash';
    const now = new Date();

    const createdSupplyInvoice = await prisma.$transaction(async (tx) => {
      // 1. Check item exists in inventory
      const product = await tx.product.findUnique({
        where: { itemId: cleanItemId },
      });

      if (!product) {
        throw new Error(`Item ID "${itemId}" not found in inventory. Please add it to inventory first.`);
      }

      // 2. Create Supply Invoice
      const supplyInvoice = await tx.supplyInvoice.create({
        data: {
          invoiceNo: invoiceNo.trim(),
          supplierCode: supCode,
          itemId: product.itemId,
          buyingPrice: bPrice,
          quantity: qty,
          paymentStatus: pStatus,
          chequeNo: pStatus === 'Cheque' ? chequeNo.trim() : '',
          branchCode: pStatus === 'Cheque' ? branchCode.trim() : '',
          bankCode: pStatus === 'Cheque' ? bankCode.trim() : '',
          valueDate: pStatus === 'Cheque' && valueDate ? new Date(valueDate) : null,
          createdAt: now,
        },
      });

      // 3. Increment stock quantity and update buying price
      await tx.product.update({
        where: { id: product.id },
        data: {
          quantity: product.quantity + qty,
          buyingPrice: bPrice,
          supplierCode: supCode,
          paymentMethod: pStatus,
        },
      });

      // 4. Record stock movement
      await tx.stockMovement.create({
        data: {
          itemId: product.itemId,
          supplierCode: supCode,
          quantity: qty,
          unitPrice: bPrice,
          buyingPrice: bPrice,
          paymentMethod: pStatus,
          movedAt: now,
        },
      });

      // 5. Ensure Supplier exists
      await tx.supplier.upsert({
        where: { supplierCode: supCode },
        update: {},
        create: {
          supplierCode: supCode,
          name: supCode,
          contact: '',
          invoice: invoiceNo.trim(),
        },
      });

      return supplyInvoice;
    });

    res.status(201).json({
      success: true,
      message: 'Supply invoice recorded and inventory updated successfully.',
      supplyInvoice: {
        ...createdSupplyInvoice,
        buyingPrice: Number(createdSupplyInvoice.buyingPrice),
      },
    });
  } catch (error: any) {
    if (error.message?.includes('not found in inventory')) {
      res.status(404).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
}

export async function settleSupplyInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { invoiceIds } = req.body;
    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      res.status(400).json({ success: false, error: 'Array of supply invoice IDs is required.' });
      return;
    }

    const now = new Date();
    await prisma.supplyInvoice.updateMany({
      where: {
        id: { in: invoiceIds },
        settledAt: null,
      },
      data: {
        settledAt: now,
      },
    });

    res.json({
      success: true,
      message: `${invoiceIds.length} supply invoice(s) marked as settled.`,
    });
  } catch (error) {
    next(error);
  }
}
