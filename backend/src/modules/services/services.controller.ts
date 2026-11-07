import { Request, Response, NextFunction } from 'express';
import { Service } from '../../models/Service.js';
import { DEFAULT_SERVICES } from '../../config/constants.js';

export async function getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = (req.query.category as string)?.trim();
    const search = (req.query.search as string)?.trim();

    const filter: any = {};
    if (category && category !== 'All') {
      // If a vehicle type is provided, return that vehicle type's services + 'Others'
      if (category.toLowerCase() !== 'others') {
        filter.$or = [
          { category: new RegExp(`^${category}$`, 'i') },
          { category: 'Others' },
        ];
      } else {
        filter.category = 'Others';
      }
    }

    if (search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    // Auto-seed if completely empty
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(DEFAULT_SERVICES.map((s) => ({ ...s, description: '' })));
    }

    const services = await Service.find(filter).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      services: services.map((s) => ({
        id: s._id,
        category: s.category,
        name: s.name,
        price: s.price,
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

    const service = await Service.create({
      category: category || 'Others',
      name: name.trim(),
      price: priceNum,
      description: (description || '').trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      service: {
        id: service._id,
        category: service.category,
        name: service.name,
        price: service.price,
        description: service.description,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, error: 'This service already exists in this category.' });
      return;
    }
    next(error);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
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

    const service = await Service.findByIdAndUpdate(
      id,
      {
        category: category || 'Others',
        name: name.trim(),
        price: priceNum,
        description: (description || '').trim(),
      },
      { new: true }
    );

    if (!service) {
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Service updated successfully.',
      service: {
        id: service._id,
        category: service.category,
        name: service.name,
        price: service.price,
        description: service.description,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, error: 'This service already exists in this category.' });
      return;
    }
    next(error);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }

    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
