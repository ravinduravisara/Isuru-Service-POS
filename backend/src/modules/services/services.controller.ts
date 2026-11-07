import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { DEFAULT_SERVICES } from '../../config/constants.js';

export async function getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = (req.query.category as string)?.trim();
    const search = (req.query.search as string)?.trim();

    // Auto-seed if completely empty
    const count = await prisma.service.count();
    if (count === 0) {
      await prisma.service.createMany({
        data: DEFAULT_SERVICES.map((s) => ({
          category: s.category,
          name: s.name,
          price: s.price,
          description: '',
        })),
        skipDuplicates: true,
      });
    }

    const where: any = {};
    const includeCustom = req.query.includeCustom === 'true';

    if (category && category !== 'All') {
      if (includeCustom && category.toLowerCase() !== 'custom') {
        where.OR = [
          { category: { equals: category, mode: 'insensitive' } },
          { category: 'Custom' },
        ];
      } else {
        where.category = { equals: category, mode: 'insensitive' };
      }
    }

    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    res.json({
      success: true,
      services: services.map((s) => ({
        id: s.id,
        _id: s.id,
        category: s.category,
        name: s.name,
        price: Number(s.price),
        description: s.description || '',
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function createService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, name, price, description } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Service name is required.' });
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      res.status(400).json({ success: false, error: 'Valid non-negative price is required.' });
      return;
    }

    const service = await prisma.service.create({
      data: {
        category: category || 'Others',
        name: name.trim(),
        price: priceNum,
        description: (description || '').trim(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      service: {
        id: service.id,
        _id: service.id,
        category: service.category,
        name: service.name,
        price: Number(service.price),
        description: service.description,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, error: 'This service already exists in this category.' });
      return;
    }
    next(error);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { category, name, price, description } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Service name is required.' });
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      res.status(400).json({ success: false, error: 'Valid non-negative price is required.' });
      return;
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        category: category || 'Others',
        name: name.trim(),
        price: priceNum,
        description: (description || '').trim(),
      },
    });

    res.json({
      success: true,
      message: 'Service updated successfully.',
      service: {
        id: service.id,
        _id: service.id,
        category: service.category,
        name: service.name,
        price: Number(service.price),
        description: service.description,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, error: 'This service already exists in this category.' });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }
    next(error);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await prisma.service.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }
    next(error);
  }
}

const DEFAULT_SERVICE_PRESETS = [
  'Service Charge',
  'Engine Wash',
  'Engine Chemical',
  'Grease',
  'Penetrating Oil',
  'Diesel',
  'Kerosene',
  'High Pressure',
  'Chemical',
  'Body Wash',
  'Grease Full',
  'FullService',
  'Custom',
  'Diesel Filter',
  'Air filter',
  'Cabin Filter',
  'Engine Oil',
  'Gear Oil',
  'Differencel Oil',
  'Transfer Box Oil',
  'Break Oil',
  'Hydralauic Oil',
  'Power Sterling Oil',
  'Battery Water',
  'Radiator Coolant',
  'Radiator Plask',
  'Wash',
  'Car Wash',
  'Wapper Blade',
];

export async function getServicePresets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'service_presets' },
    });

    let presets: string[] = DEFAULT_SERVICE_PRESETS;
    if (setting?.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          presets = parsed;
        }
      } catch {
        presets = [...DEFAULT_SERVICE_PRESETS];
      }
    } else {
      await prisma.setting.upsert({
        where: { key: 'service_presets' },
        update: {},
        create: { key: 'service_presets', value: JSON.stringify(DEFAULT_SERVICE_PRESETS) },
      });
    }

    res.json({ success: true, presets });
  } catch (error) {
    next(error);
  }
}

export async function createServicePreset(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Preset name is required.' });
      return;
    }

    const cleanName = name.trim();

    const setting = await prisma.setting.findUnique({
      where: { key: 'service_presets' },
    });
    let presets: string[] = DEFAULT_SERVICE_PRESETS;
    if (setting?.value) {
      try {
        presets = JSON.parse(setting.value);
      } catch {
        presets = [...DEFAULT_SERVICE_PRESETS];
      }
    }

    if (presets.some((p) => p.toLowerCase() === cleanName.toLowerCase())) {
      res.status(409).json({ success: false, error: `Preset "${cleanName}" already exists.` });
      return;
    }

    presets.push(cleanName);

    await prisma.setting.upsert({
      where: { key: 'service_presets' },
      update: { value: JSON.stringify(presets) },
      create: { key: 'service_presets', value: JSON.stringify(presets) },
    });

    res.status(201).json({
      success: true,
      message: `Preset "${cleanName}" added successfully.`,
      presets,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateServicePreset(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const oldName = decodeURIComponent(req.params.name as string).trim();
    const { newName } = req.body;

    if (!newName || !newName.trim()) {
      res.status(400).json({ success: false, error: 'New preset name is required.' });
      return;
    }

    const cleanNewName = newName.trim();

    const setting = await prisma.setting.findUnique({
      where: { key: 'service_presets' },
    });
    let presets: string[] = DEFAULT_SERVICE_PRESETS;
    if (setting?.value) {
      try {
        presets = JSON.parse(setting.value);
      } catch {
        presets = [...DEFAULT_SERVICE_PRESETS];
      }
    }

    const index = presets.findIndex((p) => p.toLowerCase() === oldName.toLowerCase());
    if (index === -1) {
      res.status(404).json({ success: false, error: `Preset "${oldName}" not found.` });
      return;
    }

    if (presets.some((p, idx) => idx !== index && p.toLowerCase() === cleanNewName.toLowerCase())) {
      res.status(409).json({ success: false, error: `Preset "${cleanNewName}" already exists.` });
      return;
    }

    presets[index] = cleanNewName;

    await prisma.setting.upsert({
      where: { key: 'service_presets' },
      update: { value: JSON.stringify(presets) },
      create: { key: 'service_presets', value: JSON.stringify(presets) },
    });

    res.json({
      success: true,
      message: `Preset renamed from "${oldName}" to "${cleanNewName}".`,
      presets,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteServicePreset(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const name = decodeURIComponent(req.params.name as string).trim();

    const setting = await prisma.setting.findUnique({
      where: { key: 'service_presets' },
    });
    let presets: string[] = DEFAULT_SERVICE_PRESETS;
    if (setting?.value) {
      try {
        presets = JSON.parse(setting.value);
      } catch {
        presets = [...DEFAULT_SERVICE_PRESETS];
      }
    }

    presets = presets.filter((p) => p.toLowerCase() !== name.toLowerCase());

    await prisma.setting.upsert({
      where: { key: 'service_presets' },
      update: { value: JSON.stringify(presets) },
      create: { key: 'service_presets', value: JSON.stringify(presets) },
    });

    res.json({
      success: true,
      message: `Preset "${name}" removed successfully.`,
      presets,
    });
  } catch (error) {
    next(error);
  }
}
