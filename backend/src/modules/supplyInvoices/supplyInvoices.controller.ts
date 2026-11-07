import { Request, Response, NextFunction } from 'express';
import { SupplyInvoice } from '../../models/SupplyInvoice.js';
import { Product } from '../../models/Product.js';
import { Supplier } from '../../models/Supplier.js';
import { StockMovement } from '../../models/StockMovement.js';

export async function getSupplyInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';
    const paymentStatus = (req.query.paymentStatus as string)?.trim() || '';

    const filter: any = {};
    if (search) {
      filter.$or = [
        { invoiceNo: { $regex: search, $options: 'i' } },
        { supplierCode: { $regex: search, $options: 'i' } },
        { itemId: { $regex: search, $options: 'i' } },
      ];
    }
    if (paymentStatus && paymentStatus !== 'All') {
      filter.paymentStatus = paymentStatus;
    }

    const invoices = await SupplyInvoice.find(filter).sort({ createdAt: -1, _id: -1 });

    let totalAmount = 0;
    let cashTotal = 0;
    let creditTotal = 0;
    let chequeTotal = 0;

    const formatted = invoices.map((inv) => {
      const lineTotal = inv.quantity * inv.buyingPrice;
      totalAmount += lineTotal;
      if (inv.paymentStatus === 'Credit') creditTotal += lineTotal;
      else if (inv.paymentStatus === 'Cheque') chequeTotal += lineTotal;
      else cashTotal += lineTotal;

      return {
        id: inv._id,
        invoiceNo: inv.invoiceNo,
        supplierCode: inv.supplierCode,
        itemId: inv.itemId,
        buyingPrice: inv.buyingPrice,
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
        totalAmount,
        cashTotal,
        creditTotal,
        chequeTotal,
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

    // 1. Check item exists in inventory
    const product = await Product.findOne({ itemId: itemId.trim().toUpperCase() });
    if (!product) {
      res.status(404).json({ success: false, error: `Item ID "${itemId}" not found in inventory. Please add it to inventory first.` });
      return;
    }

    const now = new Date();
    const supCode = supplierCode.trim().toUpperCase();
    const pStatus = paymentStatus === 'Credit' || paymentStatus === 'Cheque' ? paymentStatus : 'Cash';

    // 2. Create Supply Invoice
    const supplyInvoice = await SupplyInvoice.create({
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
    });

    // 3. Increment stock quantity and update buying price in inventory
    product.quantity += qty;
    product.buyingPrice = bPrice;
    product.supplierCode = supCode;
    product.paymentMethod = pStatus;
    product.updatedAt = now;
    await product.save();

    // 4. Record stock movement
    await StockMovement.create({
      itemId: product.itemId,
      supplierCode: supCode,
      quantity: qty,
      unitPrice: bPrice,
      buyingPrice: bPrice,
      paymentMethod: pStatus,
      movedAt: now,
    });

    // 5. Ensure Supplier exists
    await Supplier.findOneAndUpdate(
      { supplierCode: supCode },
      {
        $setOnInsert: {
          supplierCode: supCode,
          name: supCode,
          contact: '',
          cashTotal: 0,
          creditTotal: 0,
          chequeTotal: 0,
          invoice: invoiceNo.trim(),
          createdAt: now,
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Supply invoice recorded and inventory updated successfully.',
      supplyInvoice,
    });
  } catch (error) {
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
    await SupplyInvoice.updateMany(
      { _id: { $in: invoiceIds }, settledAt: null },
      { $set: { settledAt: now } }
    );

    res.json({
      success: true,
      message: `${invoiceIds.length} supply invoice(s) marked as settled.`,
    });
  } catch (error) {
    next(error);
  }
}
