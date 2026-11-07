import { Request, Response, NextFunction } from 'express';
import { Customer } from '../../models/Customer.js';
import { Vehicle } from '../../models/Vehicle.js';
import { Invoice } from '../../models/Invoice.js';

export async function getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(filter).sort({ name: 1 });

    // Aggregate vehicle counts
    const vehicleCounts = await Vehicle.aggregate([
      { $group: { _id: '$customerId', count: { $sum: 1 } } },
    ]);
    const countsMap = new Map<string, number>();
    vehicleCounts.forEach((vc) => countsMap.set(vc._id.toString(), vc.count));

    const result = customers.map((c) => ({
      id: c._id,
      name: c.name,
      phone: c.phone || '',
      vehiclesCount: countsMap.get(c._id.toString()) || 0,
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

    const customers = await Customer.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ],
    })
      .limit(10)
      .sort({ name: 1 });

    const customerIds = customers.map((c) => c._id);
    const vehicles = await Vehicle.find({ customerId: { $in: customerIds } });

    const customerVehiclesMap = new Map<string, any[]>();
    vehicles.forEach((v) => {
      const cid = v.customerId.toString();
      if (!customerVehiclesMap.has(cid)) customerVehiclesMap.set(cid, []);
      customerVehiclesMap.get(cid)!.push({
        id: v._id,
        vehicleNo: v.vehicleNo,
        vehicleType: v.vehicleType,
      });
    });

    const result = customers.map((c) => ({
      id: c._id,
      name: c.name,
      phone: c.phone,
      vehicles: customerVehiclesMap.get(c._id.toString()) || [],
    }));

    res.json({ success: true, customers: result });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }

    const [vehicles, invoices] = await Promise.all([
      Vehicle.find({ customerId: customer._id }).sort({ vehicleNo: 1 }),
      Invoice.find({ customerId: customer._id }).sort({ dateTime: -1 }),
    ]);

    res.json({
      success: true,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        createdAt: customer.createdAt,
      },
      vehicles,
      invoices,
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

    const customer = await Customer.create({
      name: name.trim(),
      phone: (phone || '').trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully.',
      customer: {
        id: customer._id,
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
    const { id } = req.params;
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Customer name is required.' });
      return;
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      { name: name.trim(), phone: (phone || '').trim(), updatedAt: new Date() },
      { new: true }
    );

    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Customer updated successfully.',
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer not found.' });
      return;
    }

    res.json({ success: true, message: 'Customer deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
