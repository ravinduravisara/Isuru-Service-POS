import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';

    const customers = await prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
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
      phone: c.phone,
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
        phone: customer.phone,
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
    const { name, phone } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Customer name is required.' });
      return;
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        phone: (phone || '').trim(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully.',
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Customer name is required.' });
      return;
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: name.trim(),
        phone: (phone || '').trim(),
      },
    });

    res.json({
      success: true,
      message: 'Customer updated successfully.',
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
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
    await prisma.customer.delete({
      where: { id },
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
