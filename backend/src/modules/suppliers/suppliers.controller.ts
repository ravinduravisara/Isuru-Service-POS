import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { recordOutboxOperation } from '../../services/outbox.service.js';

export async function getSuppliers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';

    // Synchronize totals from current Product inventory state
    const products = await prisma.product.findMany({
      where: {
        supplierCode: { not: '' },
      },
      select: {
        supplierCode: true,
        paymentMethod: true,
        quantity: true,
        buyingPrice: true,
      },
    });

    const supplierTotals = new Map<string, { cash: number; credit: number; cheque: number }>();
    products.forEach((p) => {
      const code = p.supplierCode.toUpperCase();
      if (!supplierTotals.has(code)) {
        supplierTotals.set(code, { cash: 0, credit: 0, cheque: 0 });
      }
      const current = supplierTotals.get(code)!;
      const total = p.quantity * Number(p.buyingPrice);
      const pm = p.paymentMethod.toLowerCase();
      if (pm.includes('credit')) current.credit += total;
      else if (pm.includes('cheque')) current.cheque += total;
      else current.cash += total;
    });

    const where: any = {};
    if (search) {
      where.OR = [
        { supplierCode: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
      ];
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const result = suppliers.map((s) => {
      const totals = supplierTotals.get(s.supplierCode.toUpperCase()) || { cash: 0, credit: 0, cheque: 0 };
      return {
        id: s.id,
        _id: s.id,
        supplierCode: s.supplierCode,
        name: s.name,
        contact: s.contact || '',
        cashTotal: Math.round(totals.cash * 100) / 100,
        creditTotal: Math.round(totals.credit * 100) / 100,
        chequeTotal: Math.round(totals.cheque * 100) / 100,
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
      const last = await prisma.supplier.findFirst({
        where: { supplierCode: { startsWith: 'SUP-' } },
        orderBy: { supplierCode: 'desc' },
      });
      let nextNum = 1;
      if (last && last.supplierCode) {
        const parts = last.supplierCode.split('-');
        if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
          nextNum = parseInt(parts[1], 10) + 1;
        }
      }
      finalCode = `SUP-${String(nextNum).padStart(4, '0')}`;
    }

    const supplier = await prisma.$transaction(async (tx) => {
      const created = await tx.supplier.create({
        data: {
          supplierCode: finalCode,
          name: name.trim(),
          contact: contact.trim(),
          invoice: invoice.trim(),
        },
      });

      await recordOutboxOperation(tx, {
        entityType: 'SUPPLIER' as any,
        entityId: created.id,
        operationType: 'CREATE',
        idempotencyKey: `sup-${created.id}`,
        payload: {
          id: created.id,
          supplierCode: created.supplierCode,
          name: created.name,
          contact: created.contact,
          invoice: created.invoice,
        },
      });

      return created;
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully.',
      supplier: {
        ...supplier,
        cashTotal: Number(supplier.cashTotal),
        creditTotal: Number(supplier.creditTotal),
        chequeTotal: Number(supplier.chequeTotal),
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, error: 'Supplier code already exists.' });
      return;
    }
    next(error);
  }
}

export async function updateSupplier(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { name, contact, invoice } = req.body;

    const data: any = {};
    if (name) data.name = name.trim();
    if (contact !== undefined) data.contact = contact.trim();
    if (invoice !== undefined) data.invoice = invoice.trim();

    const supplier = await prisma.supplier.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: 'Supplier updated successfully.',
      supplier: {
        ...supplier,
        cashTotal: Number(supplier.cashTotal),
        creditTotal: Number(supplier.creditTotal),
        chequeTotal: Number(supplier.chequeTotal),
      },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Supplier not found.' });
      return;
    }
    next(error);
  }
}

export async function updateSupplierInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { invoice = '' } = req.body;

    const supplier = await prisma.supplier.update({
      where: { id },
      data: { invoice: invoice.trim() },
    });

    res.json({
      success: true,
      message: 'Supplier invoice memo updated.',
      supplier: {
        ...supplier,
        cashTotal: Number(supplier.cashTotal),
        creditTotal: Number(supplier.creditTotal),
        chequeTotal: Number(supplier.chequeTotal),
      },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Supplier not found.' });
      return;
    }
    next(error);
  }
}

export async function deleteSupplier(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await prisma.supplier.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Supplier deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Supplier not found.' });
      return;
    }
    next(error);
  }
}

export async function getSupplierMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { supplierCode } = req.params;
    const paymentMethod = (req.query.paymentMethod as string)?.trim();

    const codeStr = (Array.isArray(supplierCode) ? supplierCode[0] : supplierCode || '').toUpperCase();
    const where: any = {
      supplierCode: { equals: codeStr, mode: 'insensitive' },
    };
    if (paymentMethod && paymentMethod !== 'All') {
      where.paymentMethod = { equals: paymentMethod, mode: 'insensitive' };
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      orderBy: { movedAt: 'desc' },
    });

    let totalAmount = 0;
    let unsettledAmount = 0;

    const formatted = movements.map((m) => {
      const buyingPrice = Number(m.buyingPrice);
      const lineTotal = m.quantity * buyingPrice;
      totalAmount += lineTotal;
      const isSettled = Boolean(m.settledAt);
      if (!isSettled) unsettledAmount += lineTotal;

      return {
        id: m.id,
        _id: m.id,
        movedAt: m.movedAt,
        itemId: m.itemId,
        quantity: m.quantity,
        buyingPrice,
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
        totalAmount: Math.round(totalAmount * 100) / 100,
        unsettledAmount: Math.round(unsettledAmount * 100) / 100,
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
    await prisma.stockMovement.updateMany({
      where: {
        id: { in: movementIds },
        settledAt: null,
      },
      data: {
        settledAt: now,
      },
    });

    res.json({
      success: true,
      message: `${movementIds.length} items marked as settled.`,
    });
  } catch (error) {
    next(error);
  }
}
