import { Request, Response, NextFunction } from 'express';
import { Supplier } from '../../models/Supplier.js';
import { Product } from '../../models/Product.js';
import { StockMovement } from '../../models/StockMovement.js';

export async function getSuppliers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';

    // Synchronize totals from current Product inventory state
    const inventoryAgg = await Product.aggregate([
      { $match: { supplierCode: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: {
            supplierCode: '$supplierCode',
            method: {
              $cond: [
                { $regexMatch: { input: '$paymentMethod', regex: /credit/i } },
                'Credit',
                {
                  $cond: [
                    { $regexMatch: { input: '$paymentMethod', regex: /cheque/i } },
                    'Cheque',
                    'Cash',
                  ],
                },
              ],
            },
          },
          total: { $sum: { $multiply: ['$quantity', '$buyingPrice'] } },
        },
      },
    ]);

    // Build map of totals per supplier code
    const supplierTotals = new Map<string, { cash: number; credit: number; cheque: number }>();
    inventoryAgg.forEach((entry) => {
      const code = entry._id.supplierCode;
      if (!supplierTotals.has(code)) {
        supplierTotals.set(code, { cash: 0, credit: 0, cheque: 0 });
      }
      const current = supplierTotals.get(code)!;
      if (entry._id.method === 'Credit') current.credit += entry.total;
      else if (entry._id.method === 'Cheque') current.cheque += entry.total;
      else current.cash += entry.total;
    });

    const filter: any = {};
    if (search) {
      filter.$or = [
        { supplierCode: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
      ];
    }

    const suppliers = await Supplier.find(filter).sort({ name: 1 });

    // Update synced totals in memory/response
    const result = suppliers.map((s) => {
      const totals = supplierTotals.get(s.supplierCode) || { cash: 0, credit: 0, cheque: 0 };
      return {
        id: s._id,
        supplierCode: s.supplierCode,
        name: s.name,
        contact: s.contact || '',
        cashTotal: totals.cash,
        creditTotal: totals.credit,
        chequeTotal: totals.cheque,
        invoice: s.invoice || '',
        createdAt: s.createdAt,
      };
    });

    res.json({ success: true, suppliers: result });
  } catch (error) {
    next(error);
  }
}

export async function createSupplier(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { supplierCode, name, contact = '', invoice = '' } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Supplier name is required.' });
      return;
    }

    let finalCode = supplierCode?.trim().toUpperCase();
    if (!finalCode) {
      const last = await Supplier.findOne({ supplierCode: /^SUP-/ }).sort({ supplierCode: -1 });
      let nextNum = 1;
      if (last && last.supplierCode) {
        const parts = last.supplierCode.split('-');
        if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
          nextNum = parseInt(parts[1], 10) + 1;
        }
      }
      finalCode = `SUP-${String(nextNum).padStart(4, '0')}`;
    }

    const supplier = await Supplier.create({
      supplierCode: finalCode,
      name: name.trim(),
      contact: contact.trim(),
      invoice: invoice.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully.',
      supplier,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, error: 'Supplier code already exists.' });
      return;
    }
    next(error);
  }
}

export async function updateSupplier(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { name, contact, invoice } = req.body;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      res.status(404).json({ success: false, error: 'Supplier not found.' });
      return;
    }

    if (name) supplier.name = name.trim();
    if (contact !== undefined) supplier.contact = contact.trim();
    if (invoice !== undefined) supplier.invoice = invoice.trim();

    await supplier.save();

    res.json({
      success: true,
      message: 'Supplier updated successfully.',
      supplier,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSupplierInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { invoice = '' } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      { invoice: invoice.trim() },
      { new: true }
    );

    if (!supplier) {
      res.status(404).json({ success: false, error: 'Supplier not found.' });
      return;
    }

    res.json({ success: true, message: 'Supplier invoice memo updated.', supplier });
  } catch (error) {
    next(error);
  }
}

export async function deleteSupplier(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) {
      res.status(404).json({ success: false, error: 'Supplier not found.' });
      return;
    }

    res.json({ success: true, message: 'Supplier deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function getSupplierMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { supplierCode } = req.params;
    const paymentMethod = (req.query.paymentMethod as string)?.trim();

    const codeStr = (Array.isArray(supplierCode) ? supplierCode[0] : supplierCode || '').toUpperCase();
    const filter: any = { supplierCode: codeStr };
    if (paymentMethod && paymentMethod !== 'All') {
      filter.paymentMethod = paymentMethod;
    }

    const movements = await StockMovement.find(filter).sort({ movedAt: -1 });

    let totalAmount = 0;
    let unsettledAmount = 0;

    const formatted = movements.map((m) => {
      const lineTotal = m.quantity * m.buyingPrice;
      totalAmount += lineTotal;
      const isSettled = Boolean(m.settledAt);
      if (!isSettled) unsettledAmount += lineTotal;

      return {
        id: m._id,
        movedAt: m.movedAt,
        itemId: m.itemId,
        quantity: m.quantity,
        buyingPrice: m.buyingPrice,
        total: lineTotal,
        paymentMethod: m.paymentMethod,
        isSettled,
        settledAt: m.settledAt,
      };
    });

    res.json({
      success: true,
      movements: formatted,
      summary: {
        totalAmount,
        unsettledAmount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function settleMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { movementIds } = req.body;
    if (!Array.isArray(movementIds) || movementIds.length === 0) {
      res.status(400).json({ success: false, error: 'Array of movement IDs is required.' });
      return;
    }

    const now = new Date();
    await StockMovement.updateMany(
      { _id: { $in: movementIds }, settledAt: null },
      { $set: { settledAt: now } }
    );

    res.json({
      success: true,
      message: `${movementIds.length} items marked as settled.`,
    });
  } catch (error) {
    next(error);
  }
}
