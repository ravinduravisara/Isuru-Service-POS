import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';
    const category = (req.query.category as string)?.trim() || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { itemId: { contains: search, mode: 'insensitive' } },
        { itemName: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { supplierCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category && category !== 'All') {
      where.itemName = category;
    }

    const items = await prisma.product.findMany({
      where,
      orderBy: [{ itemName: 'asc' }, { brand: 'asc' }],
    });

    let totalSellingValue = 0;
    let totalCostValue = 0;
    let lowStockCount = 0;

    const formatted = items.map((p) => {
      const unitPrice = Number(p.unitPrice);
      const buyingPrice = Number(p.buyingPrice);
      const sellingValue = p.quantity * unitPrice;
      const costValue = p.quantity * buyingPrice;
      totalSellingValue += sellingValue;
      totalCostValue += costValue;
      if (p.quantity <= 5) lowStockCount++;

      return {
        id: p.id,
        _id: p.id,
        itemId: p.itemId,
        itemName: p.itemName,
        brand: p.brand || '',
        quantity: p.quantity,
        unitPrice,
        buyingPrice,
        sellingValue,
        costValue,
        supplierCode: p.supplierCode || '',
        paymentMethod: p.paymentMethod || 'Cash',
        updatedAt: p.updatedAt,
      };
    });

    // Compute total products in entire catalog (unfiltered)
    const totalCatalogItems = await prisma.product.count();

    res.json({
      success: true,
      items: formatted,
      summary: {
        totalItems: totalCatalogItems,
        filteredCount: items.length,
        totalSellingValue: Math.round(totalSellingValue * 100) / 100,
        totalCostValue: Math.round(totalCostValue * 100) / 100,
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

    let product = await prisma.product.findUnique({
      where: { itemId: cleanItemId },
    });

    if (!product) {
      // Match dual-code parts (e.g. "EO-24070 / LR004459" matching either code)
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { itemId: { equals: cleanItemId, mode: 'insensitive' } },
            { itemId: { startsWith: `${cleanItemId} /`, mode: 'insensitive' } },
            { itemId: { endsWith: `/ ${cleanItemId}`, mode: 'insensitive' } },
            { itemId: { contains: cleanItemId, mode: 'insensitive' } },
          ],
        },
      });
    }

    if (!product) {
      res.json({ success: false, found: false, message: 'Item not found in inventory' });
      return;
    }

    res.json({
      success: true,
      found: true,
      product: {
        id: product.id,
        _id: product.id,
        itemId: product.itemId,
        itemName: product.itemName,
        brand: product.brand,
        quantity: product.quantity,
        unitPrice: Number(product.unitPrice),
        buyingPrice: Number(product.buyingPrice),
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

    const now = new Date();

    // Check if an existing product matches by customItemId or Category + Brand + UnitPrice
    let existing = null;
    if (customItemId && customItemId.trim()) {
      existing = await prisma.product.findUnique({
        where: { itemId: customItemId.trim().toUpperCase() },
      });
    } else {
      existing = await prisma.product.findFirst({
        where: {
          itemName: itemName.trim(),
          brand: brand.trim(),
          unitPrice: price,
        },
      });
    }

    if (existing) {
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.product.update({
          where: { id: existing.id },
          data: {
            quantity: { increment: qty },
            unitPrice: price,
            buyingPrice: bPrice,
            supplierCode: supplierCode.trim() || existing.supplierCode,
            paymentMethod,
          },
        });

        await tx.stockMovement.create({
          data: {
            itemId: updated.itemId,
            supplierCode: updated.supplierCode,
            quantity: qty,
            unitPrice: price,
            buyingPrice: bPrice,
            paymentMethod,
            movedAt: now,
          },
        });

        return updated;
      });

      res.json({
        success: true,
        message: 'Existing item stock incremented successfully.',
        product: {
          ...result,
          unitPrice: Number(result.unitPrice),
          buyingPrice: Number(result.buyingPrice),
        },
      });
      return;
    }

    // Auto-generate Item ID if not provided
    let finalItemId = customItemId?.trim().toUpperCase();
    if (!finalItemId) {
      const prefix =
        itemName
          .trim()
          .toUpperCase()
          .replace(/[^A-Z]/g, '')
          .slice(0, 3) || 'CAT';

      const lastItem = await prisma.product.findFirst({
        where: { itemId: { startsWith: `${prefix}-` } },
        orderBy: { itemId: 'desc' },
      });

      let nextNum = 1;
      if (lastItem && lastItem.itemId) {
        const parts = lastItem.itemId.split('-');
        if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
          nextNum = parseInt(parts[1], 10) + 1;
        }
      }
      finalItemId = `${prefix}-${String(nextNum).padStart(4, '0')}`;
    }

    const createdProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          itemId: finalItemId,
          itemName: itemName.trim(),
          brand: brand.trim(),
          quantity: qty,
          unitPrice: price,
          buyingPrice: bPrice,
          supplierCode: supplierCode.trim(),
          paymentMethod,
        },
      });

      await tx.stockMovement.create({
        data: {
          itemId: finalItemId,
          supplierCode: supplierCode.trim(),
          quantity: qty,
          unitPrice: price,
          buyingPrice: bPrice,
          paymentMethod,
          movedAt: now,
        },
      });

      return product;
    });

    res.status(201).json({
      success: true,
      message: 'Product added to inventory successfully.',
      product: {
        ...createdProduct,
        unitPrice: Number(createdProduct.unitPrice),
        buyingPrice: Number(createdProduct.buyingPrice),
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, error: 'Product with this Item ID already exists.' });
      return;
    }
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const {
      itemName,
      brand,
      quantity,
      unitPrice,
      buyingPrice,
      supplierCode,
      paymentMethod,
    } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    const oldQty = product.quantity;
    const newQty = quantity !== undefined ? Math.max(0, Number(quantity)) : product.quantity;
    const diff = newQty - oldQty;

    const priceNum = unitPrice !== undefined ? Math.max(0, Number(unitPrice)) : Number(product.unitPrice);
    const bPriceNum = buyingPrice !== undefined ? Math.max(0, Number(buyingPrice)) : Number(product.buyingPrice);
    const now = new Date();

    const updated = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.update({
        where: { id },
        data: {
          itemName: itemName !== undefined ? itemName.trim() : product.itemName,
          brand: brand !== undefined ? brand.trim() : product.brand,
          quantity: newQty,
          unitPrice: priceNum,
          buyingPrice: bPriceNum,
          supplierCode: supplierCode !== undefined ? supplierCode.trim() : product.supplierCode,
          paymentMethod: paymentMethod || product.paymentMethod,
        },
      });

      if (diff !== 0) {
        await tx.stockMovement.create({
          data: {
            itemId: prod.itemId,
            supplierCode: prod.supplierCode,
            quantity: diff,
            unitPrice: priceNum,
            buyingPrice: bPriceNum,
            paymentMethod: prod.paymentMethod,
            movedAt: now,
          },
        });
      }

      return prod;
    });

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: {
        ...updated,
        unitPrice: Number(updated.unitPrice),
        buyingPrice: Number(updated.buyingPrice),
      },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    next(error);
  }
}

function parseInventoryImportLine(
  line: string
): { itemId: string; price: number; lineBrand?: string; lineCategory?: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // 1. Try comma-separated (e.g. "OF-1001, 1250.00" or "OF-1001, SAKURA, 1250.00" or "OF-1001, Oil Filter, SAKURA, 1250.00")
  if (trimmed.includes(',')) {
    const parts = trimmed
      .split(',')
      .map((p) => p.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
    if (parts.length >= 2) {
      const priceStr = parts[parts.length - 1].replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr);
      const itemId = parts[0].trim().toUpperCase();
      if (itemId && !isNaN(price)) {
        let lineCategory: string | undefined;
        let lineBrand: string | undefined;
        if (parts.length === 3) {
          lineBrand = parts[1].trim();
        } else if (parts.length >= 4) {
          lineCategory = parts[1].trim();
          lineBrand = parts[2].trim();
        }
        return { itemId, price, lineBrand, lineCategory };
      }
    }
  }

  // 2. Try tab-separated (e.g. copied from Excel / Google Sheets)
  if (trimmed.includes('\t')) {
    const parts = trimmed
      .split('\t')
      .map((p) => p.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
    if (parts.length >= 2) {
      const priceStr = parts[parts.length - 1].replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr);
      const itemId = parts[0].trim().toUpperCase();
      if (itemId && !isNaN(price)) {
        let lineCategory: string | undefined;
        let lineBrand: string | undefined;
        if (parts.length === 3) {
          lineBrand = parts[1].trim();
        } else if (parts.length >= 4) {
          lineCategory = parts[1].trim();
          lineBrand = parts[2].trim();
        }
        return { itemId, price, lineBrand, lineCategory };
      }
    }
  }

  // 3. Try semicolon-separated
  if (trimmed.includes(';')) {
    const parts = trimmed
      .split(';')
      .map((p) => p.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
    if (parts.length >= 2) {
      const priceStr = parts[parts.length - 1].replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr);
      const itemId = parts[0].trim().toUpperCase();
      if (itemId && !isNaN(price)) {
        return { itemId, price };
      }
    }
  }

  // 4. Try whitespace-separated (where price is the last token on the line: e.g. "EO-24070 / LR004459 2380.00" or "C-7971  2100.00")
  const spaceMatch = trimmed.match(/^(.*?)\s+([LKR|Rs\.]*\s*[0-9,]+(?:\.[0-9]+)?)\s*$/i);
  if (spaceMatch) {
    const itemPart = spaceMatch[1].trim().replace(/^["']|["']$/g, '');
    const priceStr = spaceMatch[2].replace(/[^0-9.]/g, '');
    const price = parseFloat(priceStr);
    if (itemPart && !isNaN(price)) {
      return { itemId: itemPart.toUpperCase(), price };
    }
  }

  return null;
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

    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) {
      res.status(400).json({ success: false, error: 'CSV content is empty.' });
      return;
    }

    let importedCount = 0;
    let updatedCount = 0;
    const skippedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parsed = parseInventoryImportLine(line);

      if (!parsed) {
        // If line 0 looks like a header, don't flag as skipped
        if (
          i === 0 &&
          (line.toLowerCase().includes('item') ||
            line.toLowerCase().includes('part') ||
            line.toLowerCase().includes('code') ||
            line.toLowerCase().includes('price'))
        ) {
          continue;
        }
        skippedLines.push(line);
        continue;
      }

      const itemCategory = (parsed.lineCategory || category).trim();
      const itemBrand = (parsed.lineBrand || brand).trim();
      const targetItemId = parsed.itemId;

      const existing = await prisma.product.findUnique({
        where: { itemId: targetItemId },
      });

      if (existing) {
        // Check if existing belongs to same category and compatible brand
        const sameCategory = existing.itemName.toLowerCase() === itemCategory.toLowerCase();
        const sameBrand =
          !existing.brand || !itemBrand || existing.brand.toLowerCase() === itemBrand.toLowerCase();

        if (sameCategory && sameBrand) {
          // Legitimate price / details update of the existing item
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              unitPrice: parsed.price > 0 ? parsed.price : existing.unitPrice,
              brand: itemBrand || existing.brand,
            },
          });
          updatedCount++;
        } else {
          // Different category or different brand sharing the same item code!
          // NEVER overwrite or replace the existing item. Create a disambiguated distinct item.
          let disambiguatedId = `${itemBrand ? itemBrand.toUpperCase() + '-' : ''}${targetItemId}`;
          const clashBrand = await prisma.product.findUnique({ where: { itemId: disambiguatedId } });
          if (clashBrand) {
            const catPrefix = itemCategory.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || 'CAT';
            disambiguatedId = `${catPrefix}-${disambiguatedId}`;
          }

          await prisma.product.upsert({
            where: { itemId: disambiguatedId },
            update: {
              unitPrice: parsed.price > 0 ? parsed.price : undefined,
              itemName: itemCategory,
              brand: itemBrand,
            },
            create: {
              itemId: disambiguatedId,
              itemName: itemCategory,
              brand: itemBrand,
              quantity: 0,
              unitPrice: parsed.price,
              buyingPrice: 0,
              paymentMethod: 'Cash',
            },
          });
          importedCount++;
        }
      } else {
        await prisma.product.create({
          data: {
            itemId: targetItemId,
            itemName: itemCategory,
            brand: itemBrand,
            quantity: 0,
            unitPrice: parsed.price,
            buyingPrice: 0,
            paymentMethod: 'Cash',
          },
        });
        importedCount++;
      }
    }

    const totalProcessed = importedCount + updatedCount;
    const totalCatalogCount = await prisma.product.count();

    let message = `Successfully processed ${totalProcessed} item${totalProcessed === 1 ? '' : 's'}`;
    if (updatedCount > 0 && importedCount > 0) {
      message += ` (${importedCount} new, ${updatedCount} updated prices).`;
    } else if (updatedCount > 0) {
      message += ` (${updatedCount} updated prices).`;
    } else {
      message += ` newly added.`;
    }
    message += ` Total store catalog items: ${totalCatalogCount}.`;

    if (skippedLines.length > 0) {
      message += ` (${skippedLines.length} unparseable line${skippedLines.length > 1 ? 's' : ''} skipped).`;
    }

    res.json({
      success: true,
      message,
      importedCount: totalProcessed,
      newCount: importedCount,
      updatedCount,
      totalCatalogItems: totalCatalogCount,
      skippedCount: skippedLines.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDistinctCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await prisma.product.findMany({
      select: { itemName: true },
      distinct: ['itemName'],
      orderBy: { itemName: 'asc' },
    });

    const categories = products.map((p) => p.itemName).filter(Boolean);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}
