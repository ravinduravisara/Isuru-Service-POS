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

const DEFAULT_TYPES = ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'];

export async function getVehicleTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'vehicle_types' },
    });

    let types: string[] = DEFAULT_TYPES;
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          types = parsed;
        }
      } catch {
        types = [...DEFAULT_TYPES];
      }
    } else {
      await prisma.setting.upsert({
        where: { key: 'vehicle_types' },
        update: {},
        create: { key: 'vehicle_types', value: JSON.stringify(DEFAULT_TYPES) },
      });
    }

    // Merge distinct categories already in services or vehicles table
    const existingServices = await prisma.service.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    for (const s of existingServices) {
      if (s.category && !types.some((t) => t.toLowerCase() === s.category.toLowerCase())) {
        types.push(s.category);
      }
    }

    const existingVehicles = await prisma.vehicle.findMany({
      select: { vehicleType: true },
      distinct: ['vehicleType'],
    });
    for (const v of existingVehicles) {
      if (v.vehicleType && !types.some((t) => t.toLowerCase() === v.vehicleType.toLowerCase())) {
        types.push(v.vehicleType);
      }
    }

    res.json({ success: true, vehicleTypes: types });
  } catch (error) {
    next(error);
  }
}

export async function createVehicleType(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Vehicle type name is required.' });
      return;
    }

    const cleanName = name.trim();

    const setting = await prisma.setting.findUnique({
      where: { key: 'vehicle_types' },
    });
    let types: string[] = DEFAULT_TYPES;
    if (setting?.value) {
      try {
        types = JSON.parse(setting.value);
      } catch {
        types = [...DEFAULT_TYPES];
      }
    }

    if (types.some((t) => t.toLowerCase() === cleanName.toLowerCase())) {
      res.status(409).json({ success: false, error: `Vehicle type "${cleanName}" already exists.` });
      return;
    }

    types.push(cleanName);

    await prisma.setting.upsert({
      where: { key: 'vehicle_types' },
      update: { value: JSON.stringify(types) },
      create: { key: 'vehicle_types', value: JSON.stringify(types) },
    });

    // Auto-provision the 3 standard services for this vehicle type: FullService, Body Wash, Custom
    for (const serviceName of ['FullService', 'Body Wash', 'Custom']) {
      await prisma.service.upsert({
        where: {
          category_name: {
            category: cleanName,
            name: serviceName,
          },
        },
        update: {},
        create: {
          category: cleanName,
          name: serviceName,
          price: 0,
          description: '',
        },
      });
    }

    res.status(201).json({
      success: true,
      message: `Vehicle type "${cleanName}" created successfully with standard services.`,
      vehicleTypes: types,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateVehicleType(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const oldName = decodeURIComponent(req.params.name as string).trim();
    const { newName } = req.body;

    if (!newName || !newName.trim()) {
      res.status(400).json({ success: false, error: 'New vehicle type name is required.' });
      return;
    }

    const cleanNewName = newName.trim();

    const setting = await prisma.setting.findUnique({
      where: { key: 'vehicle_types' },
    });
    let types: string[] = DEFAULT_TYPES;
    if (setting?.value) {
      try {
        types = JSON.parse(setting.value);
      } catch {
        types = [...DEFAULT_TYPES];
      }
    }

    const index = types.findIndex((t) => t.toLowerCase() === oldName.toLowerCase());
    if (index === -1) {
      res.status(404).json({ success: false, error: `Vehicle type "${oldName}" not found.` });
      return;
    }

    if (
      types.some(
        (t, idx) => idx !== index && t.toLowerCase() === cleanNewName.toLowerCase()
      )
    ) {
      res.status(409).json({ success: false, error: `Vehicle type "${cleanNewName}" already exists.` });
      return;
    }

    types[index] = cleanNewName;

    // Transactionally update settings, services, vehicles, and invoices
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: 'vehicle_types' },
        update: { value: JSON.stringify(types) },
        create: { key: 'vehicle_types', value: JSON.stringify(types) },
      }),
      prisma.service.updateMany({
        where: { category: { equals: oldName, mode: 'insensitive' } },
        data: { category: cleanNewName },
      }),
      prisma.vehicle.updateMany({
        where: { vehicleType: { equals: oldName, mode: 'insensitive' } },
        data: { vehicleType: cleanNewName },
      }),
      prisma.invoice.updateMany({
        where: { vehicleType: { equals: oldName, mode: 'insensitive' } },
        data: { vehicleType: cleanNewName },
      }),
    ]);

    res.json({
      success: true,
      message: `Vehicle type renamed from "${oldName}" to "${cleanNewName}".`,
      vehicleTypes: types,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteVehicleType(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const name = decodeURIComponent(req.params.name as string).trim();

    if (name.toLowerCase() === 'others') {
      res.status(400).json({ success: false, error: 'The default "Others" vehicle type cannot be deleted.' });
      return;
    }

    const setting = await prisma.setting.findUnique({
      where: { key: 'vehicle_types' },
    });
    let types: string[] = DEFAULT_TYPES;
    if (setting?.value) {
      try {
        types = JSON.parse(setting.value);
      } catch {
        types = [...DEFAULT_TYPES];
      }
    }

    types = types.filter((t) => t.toLowerCase() !== name.toLowerCase());

    // Find services in the category being deleted
    const servicesInCat = await prisma.service.findMany({
      where: { category: { equals: name, mode: 'insensitive' } },
    });

    const otherServices = await prisma.service.findMany({
      where: { category: 'Others' },
      select: { name: true },
    });
    const otherNames = new Set(otherServices.map((s) => s.name.toLowerCase()));

    // Transactionally update settings and reassign existing services, vehicles, and invoices to 'Others'
    await prisma.$transaction(async (tx) => {
      await tx.setting.upsert({
        where: { key: 'vehicle_types' },
        update: { value: JSON.stringify(types) },
        create: { key: 'vehicle_types', value: JSON.stringify(types) },
      });

      for (const s of servicesInCat) {
        let targetName = s.name;
        if (otherNames.has(targetName.toLowerCase())) {
          targetName = `${s.name} (${name})`;
          let counter = 2;
          while (otherNames.has(targetName.toLowerCase())) {
            targetName = `${s.name} (${name} ${counter})`;
            counter++;
          }
        }
        otherNames.add(targetName.toLowerCase());

        await tx.service.update({
          where: { id: s.id },
          data: { category: 'Others', name: targetName },
        });
      }

      await tx.vehicle.updateMany({
        where: { vehicleType: { equals: name, mode: 'insensitive' } },
        data: { vehicleType: 'Others' },
      });

      await tx.invoice.updateMany({
        where: { vehicleType: { equals: name, mode: 'insensitive' } },
        data: { vehicleType: 'Others' },
      });
    });

    res.json({
      success: true,
      message: `Vehicle type "${name}" deleted. Associated records moved to "Others".`,
      vehicleTypes: types,
    });
  } catch (error) {
    next(error);
  }
}
