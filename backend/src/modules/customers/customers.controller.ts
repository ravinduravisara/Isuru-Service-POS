import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { recordOutboxOperation } from '../../services/outbox.service.js';

export async function getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';

    const customers = await prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { nic: { contains: search, mode: 'insensitive' } },
              { bankDetails: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        _count: {
          select: { vehicles: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const result = customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone || '',
      nic: c.nic || '',
      bankDetails: c.bankDetails || '',
      vehiclesCount: c._count.vehicles,
      createdAt: c.createdAt,
    }));

    res.json({
      success: true,
      customers: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function searchCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const q = (req.query.q as string)?.trim() || '';
    if (!q) {
      res.json({ success: true, customers: [] });
      return;
    }

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
          { nic: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { name: 'asc' },
      include: {
        vehicles: {
          select: {
            id: true,
            vehicleNo: true,
            vehicleType: true,
          },
        },
      },
    });

    const result = customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone || '',
      nic: c.nic || '',
      bankDetails: c.bankDetails || '',
      vehicles: c.vehicles.map((v) => ({
        id: v.id,
        vehicleNo: v.vehicleNo,
        vehicleType: v.vehicleType,
      })),
    }));

    res.json({ success: true, customers: result });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: {
          orderBy: { vehicleNo: 'asc' },
        },
        invoices: {
          orderBy: { dateTime: 'desc' },
        },
      },
    });

    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }

    res.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone || '',
        nic: customer.nic || '',
        bankDetails: customer.bankDetails || '',
        createdAt: customer.createdAt,
      },
      vehicles: customer.vehicles,
      invoices: customer.invoices,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const vehicles = await prisma.vehicle.findMany({
      where: { customerId: id },
      orderBy: { vehicleNo: 'asc' },
    });

    res.json({
      success: true,
      vehicles: vehicles.map((v) => ({
        id: v.id,
        customerId: v.customerId,
        vehicleNo: v.vehicleNo,
        vehicleType: v.vehicleType,
        createdAt: v.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, phone, nic, bankDetails } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Customer name is required.' });
      return;
    }

    const cleanPhone = (phone || '').trim();
    if (cleanPhone && !/^\d{10}$/.test(cleanPhone)) {
      res.status(400).json({
        success: false,
        error: 'Phone number must be exactly 10 digits (numbers only, e.g. 0771234567).',
      });
      return;
    }

    const cleanNic = (nic || '').trim().toUpperCase();
    if (cleanNic) {
      const isOldNic = /^[0-9]{9}[VX]$/.test(cleanNic);
      const isNewNic = /^[0-9]{12}$/.test(cleanNic);
      if (!isOldNic && !isNewNic) {
        res.status(400).json({
          success: false,
          error:
            'Customer ID No must be a valid Old ID (9 digits + V/X, e.g. 851234567V) or New ID (12 digits, e.g. 199812345678).',
        });
        return;
      }
    }

    const cleanBankDetails = (bankDetails || '').trim();

    const customer = await prisma.$transaction(async (tx) => {
      const c = await tx.customer.create({
        data: {
          name: name.trim(),
          phone: cleanPhone,
          nic: cleanNic,
          bankDetails: cleanBankDetails,
        },
      });

      await recordOutboxOperation(tx, {
        entityType: 'CUSTOMER',
        entityId: c.id,
        operationType: 'CREATE',
        payload: {
          id: c.id,
          name: c.name,
          phone: c.phone,
          nic: c.nic,
          bankDetails: c.bankDetails,
        },
      });

      return c;
    });

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully.',
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        nic: customer.nic,
        bankDetails: customer.bankDetails,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { name, phone, nic, bankDetails } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Customer name is required.' });
      return;
    }

    const cleanPhone = (phone || '').trim();
    if (cleanPhone && !/^\d{10}$/.test(cleanPhone)) {
      res.status(400).json({
        success: false,
        error: 'Phone number must be exactly 10 digits (numbers only, e.g. 0771234567).',
      });
      return;
    }

    const cleanNic = (nic || '').trim().toUpperCase();
    if (cleanNic) {
      const isOldNic = /^[0-9]{9}[VX]$/.test(cleanNic);
      const isNewNic = /^[0-9]{12}$/.test(cleanNic);
      if (!isOldNic && !isNewNic) {
        res.status(400).json({
          success: false,
          error:
            'Customer ID No must be a valid Old ID (9 digits + V/X, e.g. 851234567V) or New ID (12 digits, e.g. 199812345678).',
        });
        return;
      }
    }

    const cleanBankDetails = (bankDetails || '').trim();

    const customer = await prisma.$transaction(async (tx) => {
      const c = await tx.customer.update({
        where: { id },
        data: {
          name: name.trim(),
          phone: cleanPhone,
          nic: cleanNic,
          bankDetails: cleanBankDetails,
        },
      });

      await recordOutboxOperation(tx, {
        entityType: 'CUSTOMER',
        entityId: c.id,
        operationType: 'UPDATE',
        payload: {
          id: c.id,
          name: c.name,
          phone: c.phone,
          nic: c.nic,
          bankDetails: c.bankDetails,
        },
      });

      return c;
    });

    res.json({
      success: true,
      message: 'Customer updated successfully.',
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        nic: customer.nic,
        bankDetails: customer.bankDetails,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }
    next(error);
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await prisma.$transaction(async (tx) => {
      await tx.customer.delete({
        where: { id },
      });

      await recordOutboxOperation(tx, {
        entityType: 'CUSTOMER',
        entityId: id,
        operationType: 'DELETE',
        payload: { id },
      });
    });

    res.json({ success: true, message: 'Customer deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }
    next(error);
  }
}
