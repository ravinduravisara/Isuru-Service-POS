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
