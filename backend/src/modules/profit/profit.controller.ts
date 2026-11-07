import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function getProfitStatement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const fromStr = req.query.from as string;
    const toStr = req.query.to as string;

    // Default to first day of current month through today
    let fromDate: Date;
    let toDate: Date;

    if (fromStr) {
      fromDate = new Date(fromStr);
      fromDate.setHours(0, 0, 0, 0);
    } else {
      const now = new Date();
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    if (toStr) {
      toDate = new Date(toStr);
      toDate.setHours(23, 59, 59, 999);
    } else {
      toDate = new Date();
      toDate.setHours(23, 59, 59, 999);
    }

    // 1. Fetch invoices in range
    const invoices = await prisma.invoice.findMany({
      where: {
        dateTime: { gte: fromDate, lte: toDate },
      },
      include: {
        items: true,
      },
      orderBy: [{ dateTime: 'desc' }, { id: 'desc' }],
    });

    let serviceRevenue = 0;
    let partsRevenue = 0;
    let cogs = 0;
    const lines: any[] = [];

    for (const inv of invoices) {
      for (const item of inv.items) {
        const hasInventoryItem = Boolean(item.itemId && item.itemId.trim());
        const revenue = Number(item.amount);
        const itemQty = item.qty;
        const itemBuyingPrice = Number(item.buyingPrice);
        const cost = hasInventoryItem ? Math.round(itemQty * itemBuyingPrice * 100) / 100 : 0;
        const profit = Math.round((revenue - cost) * 100) / 100;

        if (hasInventoryItem) {
          partsRevenue += revenue;
          cogs += cost;
        } else {
          serviceRevenue += revenue;
        }

        lines.push({
          date: inv.dateTime,
          invoiceNo: inv.billNo,
          customerName: inv.customerName,
          vehicleNo: inv.vehicleNo,
          service: item.service,
          itemId: item.itemId || '',
          description: item.description || '',
          qty: item.qty,
          sellingPrice: Number(item.rate),
          buyingPrice: hasInventoryItem ? itemBuyingPrice : 0,
          revenue,
          cost,
          profit,
        });
      }
    }

    serviceRevenue = Math.round(serviceRevenue * 100) / 100;
    partsRevenue = Math.round(partsRevenue * 100) / 100;
    cogs = Math.round(cogs * 100) / 100;
    const totalSalesRevenue = Math.round((serviceRevenue + partsRevenue) * 100) / 100;
    const grossProfit = Math.round((totalSalesRevenue - cogs) * 100) / 100;
    const profitMargin = totalSalesRevenue > 0 ? Math.round((grossProfit / totalSalesRevenue) * 1000) / 10 : 0;

    // 2. Fetch total purchases from Supply Invoices in range
    const supplyInvoices = await prisma.supplyInvoice.findMany({
      where: {
        createdAt: { gte: fromDate, lte: toDate },
      },
      select: {
        quantity: true,
        buyingPrice: true,
      },
    });

    let totalPurchases = 0;
    for (const si of supplyInvoices) {
      totalPurchases += si.quantity * Number(si.buyingPrice);
    }
    totalPurchases = Math.round(totalPurchases * 100) / 100;
    const netProfitAfterPurchases = Math.round((grossProfit - totalPurchases) * 100) / 100;

    res.json({
      success: true,
      statement: {
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0],
        serviceRevenue,
        partsRevenue,
        totalSalesRevenue,
        cogs,
        grossProfit,
        profitMargin,
        totalPurchases,
        netProfitAfterPurchases,
        linesCount: lines.length,
        lines,
      },
    });
  } catch (error) {
    next(error);
  }
}
