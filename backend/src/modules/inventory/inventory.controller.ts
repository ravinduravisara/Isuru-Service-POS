import { Request, Response, NextFunction } from 'express';
import { Product } from '../../models/Product.js';
import { StockMovement } from '../../models/StockMovement.js';

export async function getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';
    const category = (req.query.category as string)?.trim() || '';

    const filter: any = {};
    if (search) {
      filter.$or = [
        { itemId: { $regex: search, $options: 'i' } },
        { itemName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { supplierCode: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      filter.itemName = category;
    }

    const items = await Product.find(filter).sort({ itemName: 1, brand: 1 });

    // Compute inventory valuation summary
    let totalSellingValue = 0;
    let totalCostValue = 0;
    let lowStockCount = 0;

    const formatted = items.map((p) => {
      const sellingValue = p.quantity * p.unitPrice;
      const costValue = p.quantity * p.buyingPrice;
      totalSellingValue += sellingValue;
      totalCostValue += costValue;
      if (p.quantity <= 5) lowStockCount++;

      return {
        id: p._id,
        itemId: p.itemId,
        itemName: p.itemName,
        brand: p.brand || '',
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        buyingPrice: p.buyingPrice,
        sellingValue,
        costValue,
        supplierCode: p.supplierCode || '',
        paymentMethod: p.paymentMethod || 'Cash',
        updatedAt: p.updatedAt,
      };
    });

    res.json({
      success: true,
      items: formatted,
      summary: {
        totalItems: items.length,
        totalSellingValue,
        totalCostValue,
        lowStockCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function lookupByItemId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawId = req.params.itemId || (req.query.itemId as string) || '';
    const cleanItemId = (Array.isArray(rawId) ? rawId[0] : rawId || '').trim().toUpperCase();

    if (!cleanItemId) {
      res.status(400).json({ success: false, error: 'Item ID required' });
      return;
    }

    const product = await Product.findOne({ itemId: cleanItemId });
    if (!product) {
      res.json({ success: false, found: false, message: 'Item not found in inventory' });
      return;
    }

    res.json({
      success: true,
      found: true,
      product: {
        id: product._id,
        itemId: product.itemId,
        itemName: product.itemName,
        brand: product.brand,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        buyingPrice: product.buyingPrice,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      itemId: customItemId,
      itemName,
      brand = '',
      quantity = 0,
      unitPrice = 0,
      buyingPrice = 0,
      supplierCode = '',
      paymentMethod = 'Cash',
    } = req.body;

    if (!itemName || !itemName.trim()) {
      res.status(400).json({ success: false, error: 'Category / Item name is required.' });
      return;
    }

    const qty = Math.max(0, Number(quantity) || 0);
    const price = Math.max(0, Number(unitPrice) || 0);
    const bPrice = Math.max(0, Number(buyingPrice) || 0);

    // Check if an existing product matches by customItemId or Category + Brand + UnitPrice
    let existing = null;
    if (customItemId && customItemId.trim()) {
      existing = await Product.findOne({ itemId: customItemId.trim().toUpperCase() });
    } else {
      existing = await Product.findOne({
        itemName: itemName.trim(),
        brand: brand.trim(),
        unitPrice: price,
      });
    }

    const now = new Date();

    if (existing) {
      existing.quantity += qty;
      existing.unitPrice = price;
      existing.buyingPrice = bPrice;
      existing.supplierCode = supplierCode.trim() || existing.supplierCode;
      existing.paymentMethod = paymentMethod;
      existing.updatedAt = now;
      await existing.save();

      // Record stock movement
      await StockMovement.create({
        itemId: existing.itemId,
        supplierCode: existing.supplierCode,
        quantity: qty,
        unitPrice: price,
        buyingPrice: bPrice,
        paymentMethod,
        movedAt: now,
      });

      res.json({
        success: true,
        message: 'Existing item stock incremented successfully.',
        product: existing,
      });
      return;
    }

    // Auto-generate Item ID if not provided
    let finalItemId = customItemId?.trim().toUpperCase();
    if (!finalItemId) {
      const prefix = itemName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 3) || 'CAT';

      const lastItem = await Product.findOne({ itemId: new RegExp(`^${prefix}-`) }).sort({ itemId: -1 });
      let nextNum = 1;
      if (lastItem && lastItem.itemId) {
        const parts = lastItem.itemId.split('-');
        if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
          nextNum = parseInt(parts[1], 10) + 1;
        }
      }
      finalItemId = `${prefix}-${String(nextNum).padStart(4, '0')}`;
    }

    const product = await Product.create({
      itemId: finalItemId,
      itemName: itemName.trim(),
      brand: brand.trim(),
      quantity: qty,
      unitPrice: price,
      buyingPrice: bPrice,
      supplierCode: supplierCode.trim(),
      paymentMethod,
      updatedAt: now,
    });

    // Record initial stock movement
    await StockMovement.create({
      itemId: finalItemId,
      supplierCode: supplierCode.trim(),
      quantity: qty,
      unitPrice: price,
      buyingPrice: bPrice,
      paymentMethod,
      movedAt: now,
    });

    res.status(201).json({
      success: true,
      message: 'Product added to inventory successfully.',
      product,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, error: 'Product with this Item ID already exists.' });
      return;
    }
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const {
      itemName,
      brand,
      quantity,
      unitPrice,
      buyingPrice,
      supplierCode,
      paymentMethod,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    const oldQty = product.quantity;
    const newQty = quantity !== undefined ? Math.max(0, Number(quantity)) : product.quantity;
    const diff = newQty - oldQty;

    product.itemName = itemName !== undefined ? itemName.trim() : product.itemName;
    product.brand = brand !== undefined ? brand.trim() : product.brand;
    product.quantity = newQty;
    product.unitPrice = unitPrice !== undefined ? Math.max(0, Number(unitPrice)) : product.unitPrice;
    product.buyingPrice = buyingPrice !== undefined ? Math.max(0, Number(buyingPrice)) : product.buyingPrice;
    product.supplierCode = supplierCode !== undefined ? supplierCode.trim() : product.supplierCode;
    product.paymentMethod = paymentMethod || product.paymentMethod;
    product.updatedAt = new Date();
    await product.save();

    // If quantity changed, record a movement
    if (diff !== 0) {
      await StockMovement.create({
        itemId: product.itemId,
        supplierCode: product.supplierCode,
        quantity: diff,
        unitPrice: product.unitPrice,
        buyingPrice: product.buyingPrice,
        paymentMethod: product.paymentMethod,
        movedAt: new Date(),
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function importCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, brand = '', csvContent } = req.body;

    if (!category || !category.trim()) {
      res.status(400).json({ success: false, error: 'Category is required for CSV import.' });
      return;
    }
    if (!csvContent || typeof csvContent !== 'string') {
      res.status(400).json({ success: false, error: 'CSV content string is required.' });
      return;
    }

    const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) {
      res.status(400).json({ success: false, error: 'CSV content is empty.' });
      return;
    }

    let startIdx = 0;
    // Check if header row exists
    if (lines[0].toLowerCase().includes('part') || lines[0].toLowerCase().includes('item') || lines[0].toLowerCase().includes('oe')) {
      startIdx = 1;
    }

    let importedCount = 0;
    const now = new Date();

    for (let i = startIdx; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 2) continue;

      const itemId = parts[0].toUpperCase();
      const priceStr = parts[1].replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr) || 0;

      if (!itemId) continue;

      // Upsert item
      await Product.findOneAndUpdate(
        { itemId },
        {
          $setOnInsert: {
            itemId,
            itemName: category.trim(),
            brand: brand.trim(),
            quantity: 0,
            unitPrice: price,
            buyingPrice: 0,
            updatedAt: now,
          },
        },
        { upsert: true, new: true }
      );
      importedCount++;
    }

    res.json({
      success: true,
      message: `Successfully processed CSV and imported ${importedCount} items.`,
      importedCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDistinctCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await Product.distinct('itemName');
    res.json({ success: true, categories: categories.filter(Boolean).sort() });
  } catch (error) {
    next(error);
  }
}
