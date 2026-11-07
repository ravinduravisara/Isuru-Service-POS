import { Request, Response, NextFunction } from 'express';
import { Vehicle } from '../../models/Vehicle.js';
import { Customer } from '../../models/Customer.js';

export async function getVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customerId = req.query.customerId as string;
    const search = (req.query.search as string)?.trim() || '';

    const filter: any = {};
    if (customerId) filter.customerId = customerId;
    if (search) filter.vehicleNo = { $regex: search, $options: 'i' };

    const vehicles = await Vehicle.find(filter)
      .populate('customerId', 'name phone')
      .sort({ vehicleNo: 1 });

    res.json({ success: true, vehicles });
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

    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }

    const vehicle = await Vehicle.create({
      customerId,
      vehicleNo: vehicleNo.trim().toUpperCase(),
      vehicleType: vehicleType || 'Others',
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully.',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
}
