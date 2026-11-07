import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { Setting } from '../../models/Setting.js';
import { User } from '../../models/User.js';
import { Customer } from '../../models/Customer.js';
import { Vehicle } from '../../models/Vehicle.js';
import { Invoice } from '../../models/Invoice.js';
import { Product } from '../../models/Product.js';
import { Supplier } from '../../models/Supplier.js';
import { StockMovement } from '../../models/StockMovement.js';
import { SupplyInvoice } from '../../models/SupplyInvoice.js';

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await Setting.find();
    const map = new Map<string, any>();
    settings.forEach((s) => map.set(s.key, s.value));

    const businessName = map.get('business_name') || 'Isuru Service Center';
    const businessAddress = map.get('business_address') || 'Your Address Here';
    const businessPhone = map.get('business_phone') || '+94-000-000000';
    const adminUsername = map.get('admin_username') || 'Isuru@6800';
    const userUsername = map.get('user_username') || 'User@123';

    res.json({
      success: true,
      settings: {
        businessName,
        businessAddress,
        businessPhone,
        adminUsername,
        userUsername,
        logoUrl: '/uploads/logo.png',
      },
      profile: {
        businessName,
        businessAddress,
        address: businessAddress,
        businessPhone,
        phone: businessPhone,
        logoUrl: '/uploads/logo.png',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBusinessProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { businessName, businessAddress, businessPhone } = req.body;

    const updates = [
      { key: 'business_name', value: businessName?.trim() || 'Isuru Service Center' },
      { key: 'business_address', value: businessAddress?.trim() || 'Your Address Here' },
      { key: 'business_phone', value: businessPhone?.trim() || '+94-000-000000' },
    ];

    for (const u of updates) {
      await Setting.findOneAndUpdate({ key: u.key }, { value: u.value, updatedAt: new Date() }, { upsert: true });
    }

    res.json({ success: true, message: 'Business profile updated successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function updateCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { adminUsername, adminPassword, userUsername, userPassword } = req.body;

    if (!adminUsername || !adminPassword) {
      res.status(400).json({ success: false, error: 'Admin username and password are required.' });
      return;
    }
    if (!userUsername || !userPassword) {
      res.status(400).json({ success: false, error: 'User username and password are required.' });
      return;
    }

    // Update settings collection
    const updates = [
      { key: 'admin_username', value: adminUsername.trim() },
      { key: 'admin_password', value: adminPassword },
      { key: 'user_username', value: userUsername.trim() },
      { key: 'user_password', value: userPassword },
    ];

    for (const u of updates) {
      await Setting.findOneAndUpdate({ key: u.key }, { value: u.value, updatedAt: new Date() }, { upsert: true });
    }

    // Update User documents
    const adminHash = await bcrypt.hash(adminPassword, 10);
    await User.findOneAndUpdate(
      { role: 'Admin' },
      {
        username: adminUsername.trim(),
        passwordHash: adminHash,
        role: 'Admin',
        fullName: 'Administrator',
      },
      { upsert: true }
    );

    const userHash = await bcrypt.hash(userPassword, 10);
    await User.findOneAndUpdate(
      { role: 'User' },
      {
        username: userUsername.trim(),
        passwordHash: userHash,
        role: 'User',
        fullName: 'Service Staff',
      },
      { upsert: true }
    );

    res.json({ success: true, message: 'Login credentials updated successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function uploadLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'Please choose an image file to upload.' });
      return;
    }

    res.json({
      success: true,
      message: 'Logo updated successfully.',
      logoUrl: '/uploads/logo.png?v=' + Date.now(),
    });
  } catch (error) {
    next(error);
  }
}

export async function purgeData(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type } = req.body; // 'all' | 'suppliers'

    if (type === 'suppliers') {
      await StockMovement.deleteMany({ supplierCode: { $exists: true, $ne: '' } });
      await SupplyInvoice.deleteMany({});
      await Product.updateMany({}, { $set: { supplierCode: '' } });
      await Supplier.deleteMany({});
      res.json({ success: true, message: 'Suppliers data purged successfully.' });
      return;
    }

    if (type === 'all') {
      await Promise.all([
        Invoice.deleteMany({}),
        Vehicle.deleteMany({}),
        Customer.deleteMany({}),
        StockMovement.deleteMany({}),
        SupplyInvoice.deleteMany({}),
        Supplier.deleteMany({}),
        Product.deleteMany({}),
      ]);
      res.json({ success: true, message: 'All transactional data purged successfully.' });
      return;
    }

    res.status(400).json({ success: false, error: 'Invalid purge type. Expected "all" or "suppliers".' });
  } catch (error) {
    next(error);
  }
}
