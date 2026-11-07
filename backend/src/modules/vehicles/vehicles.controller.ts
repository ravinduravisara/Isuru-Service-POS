import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function getVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customerId = req.query.customerId as string;
    const search = (req.query.search as string)?.trim() || '';

    const vehicles = await prisma.vehicle.findMany({
      where: {
        ...(customerId && { customerId }),
        ...(search && { vehicleNo: { contains: search, mode: 'insensitive' } }),
      },
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
      },
      orderBy: { vehicleNo: 'asc' },
    });

    const formatted = vehicles.map((v) => ({
      id: v.id,
      _id: v.id,
      customerId: v.customer ? { _id: v.customer.id, id: v.customer.id, name: v.customer.name, phone: v.customer.phone } : v.customerId,
      vehicleNo: v.vehicleNo,
      vehicleType: v.vehicleType,
      createdAt: v.createdAt,
      customer: v.customer,
    }));

    res.json({ success: true, vehicles: formatted });
  } catch (error) {
    next(error);
  }
}

export async function createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { customerId, vehicleNo, vehicleType } = req.body;

    if (!customerId || !vehicleNo) {
      res.status(400).json({ success: false, error: 'Customer ID and Vehicle Number are required.' });
      return;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        customerId,
        vehicleNo: vehicleNo.trim().toUpperCase(),
        vehicleType: vehicleType || 'Others',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully.',
      vehicle: {
        id: vehicle.id,
        _id: vehicle.id,
        customerId: vehicle.customerId,
        vehicleNo: vehicle.vehicleNo,
        vehicleType: vehicle.vehicleType,
        createdAt: vehicle.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
