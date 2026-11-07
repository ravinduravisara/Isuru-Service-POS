import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.setting.findMany();
    const map = new Map<string, string>();
    settings.forEach((s) => map.set(s.key, s.value));

    // Fetch active usernames strictly from the User model (never store or return passwords from settings)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'Admin' },
      select: { username: true },
    });
    const staffUser = await prisma.user.findFirst({
      where: { role: 'User' },
      select: { username: true },
    });

    const businessName = map.get('business_name') || 'Isuru Service Center';
    const businessAddress = map.get('business_address') || 'Your Address Here';
    const businessPhone = map.get('business_phone') || '+94-000-000000';
    const adminUsername = adminUser?.username || map.get('admin_username') || 'admin';
    const userUsername = staffUser?.username || map.get('user_username') || 'staff';

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

/**
 * Secure Credential Rotation
 * Updates usernames and salted bcrypt password hashes in the User table.
 * Strictly NEVER stores plaintext passwords in the settings table.
 */
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

    if (adminPassword.length < 8 || userPassword.length < 8) {
      res.status(400).json({ success: false, error: 'Passwords must be at least 8 characters long.' });
      return;
    }

    const adminHash = await bcrypt.hash(adminPassword, 12);
    const userHash = await bcrypt.hash(userPassword, 12);

    await prisma.$transaction(async (tx) => {
      // 1. Purge any legacy plaintext credentials from settings table
      await tx.setting.deleteMany({
        where: {
          key: { in: ['admin_password', 'user_password'] },
        },
      });

      // 2. Persist public usernames in settings for display reference only
      await tx.setting.upsert({
        where: { key: 'admin_username' },
        update: { value: adminUsername.trim() },
        create: { key: 'admin_username', value: adminUsername.trim() },
      });
      await tx.setting.upsert({
        where: { key: 'user_username' },
        update: { value: userUsername.trim() },
        create: { key: 'user_username', value: userUsername.trim() },
      });

      // 3. Atomically update or provision Admin user with salted bcrypt hash
      const adminByName = await tx.user.findUnique({ where: { username: adminUsername.trim() } });
      if (adminByName) {
        await tx.user.update({
          where: { id: adminByName.id },
          data: {
            role: 'Admin',
            passwordHash: adminHash,
          },
        });
      } else {
        const existingAdmin = await tx.user.findFirst({ where: { role: 'Admin' } });
        if (existingAdmin) {
          await tx.user.update({
            where: { id: existingAdmin.id },
            data: {
              username: adminUsername.trim(),
              passwordHash: adminHash,
            },
          });
        } else {
          await tx.user.create({
            data: {
              username: adminUsername.trim(),
              passwordHash: adminHash,
              role: 'Admin',
              fullName: 'Administrator',
            },
          });
        }
      }

      // 4. Atomically update or provision Staff user with salted bcrypt hash
      const staffByName = await tx.user.findUnique({ where: { username: userUsername.trim() } });
      if (staffByName) {
        await tx.user.update({
          where: { id: staffByName.id },
          data: {
            role: 'User',
            passwordHash: userHash,
          },
        });
      } else {
        const existingUser = await tx.user.findFirst({ where: { role: 'User' } });
        if (existingUser) {
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              username: userUsername.trim(),
              passwordHash: userHash,
            },
          });
        } else {
          await tx.user.create({
            data: {
              username: userUsername.trim(),
              passwordHash: userHash,
              role: 'User',
              fullName: 'Service Staff',
            },
          });
        }
      }
    });

    res.json({ success: true, message: 'Login credentials updated and hashed securely.' });
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
