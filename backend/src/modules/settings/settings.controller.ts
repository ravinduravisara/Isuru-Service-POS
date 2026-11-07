import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.setting.findMany();
    const map = new Map<string, string>();
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
      await prisma.setting.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      });
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

    const updates = [
      { key: 'admin_username', value: adminUsername.trim() },
      { key: 'admin_password', value: adminPassword },
      { key: 'user_username', value: userUsername.trim() },
      { key: 'user_password', value: userPassword },
    ];

    for (const u of updates) {
      await prisma.setting.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      });
    }

    const adminHash = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'Admin' } });
    if (existingAdmin) {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          username: adminUsername.trim(),
          passwordHash: adminHash,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          username: adminUsername.trim(),
          passwordHash: adminHash,
          role: 'Admin',
          fullName: 'Administrator',
        },
      });
    }

    const userHash = await bcrypt.hash(userPassword, 10);
    const existingUser = await prisma.user.findFirst({ where: { role: 'User' } });
    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          username: userUsername.trim(),
          passwordHash: userHash,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          username: userUsername.trim(),
          passwordHash: userHash,
          role: 'User',
          fullName: 'Service Staff',
        },
      });
    }

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
      await prisma.$transaction([
        prisma.stockMovement.deleteMany({ where: { supplierCode: { not: '' } } }),
        prisma.supplyInvoice.deleteMany({}),
        prisma.product.updateMany({ data: { supplierCode: '' } }),
        prisma.supplier.deleteMany({}),
      ]);
      res.json({ success: true, message: 'Suppliers data purged successfully.' });
      return;
    }

    if (type === 'all') {
      await prisma.$transaction([
        prisma.invoiceItem.deleteMany({}),
        prisma.invoice.deleteMany({}),
        prisma.vehicle.deleteMany({}),
        prisma.customer.deleteMany({}),
        prisma.stockMovement.deleteMany({}),
        prisma.supplyInvoice.deleteMany({}),
        prisma.supplier.deleteMany({}),
        prisma.product.deleteMany({}),
      ]);
      res.json({ success: true, message: 'All transactional data purged successfully.' });
      return;
    }

    res.status(400).json({ success: false, error: 'Invalid purge type. Expected "all" or "suppliers".' });
  } catch (error) {
    next(error);
  }
}
