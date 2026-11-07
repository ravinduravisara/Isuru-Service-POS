import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../../models/Invoice.js';
import { SupplyInvoice } from '../../models/SupplyInvoice.js';

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
    const invoices = await Invoice.find({
      dateTime: { $gte: fromDate, $lte: toDate },
    }).sort({ dateTime: -1, _id: -1 });

    let serviceRevenue = 0;
    let partsRevenue = 0;
    let cogs = 0;
    const lines: any[] = [];

    for (const inv of invoices) {
      for (const item of inv.items) {
        const hasInventoryItem = Boolean(item.itemId && item.itemId.trim());
        const revenue = item.amount;
        const cost = hasInventoryItem ? Math.round(item.qty * item.buyingPrice * 100) / 100 : 0;
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
          sellingPrice: item.rate,
          buyingPrice: hasInventoryItem ? item.buyingPrice : 0,
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
    const purchasesAgg = await SupplyInvoice.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$buyingPrice'] } } } },
    ]);
    const totalPurchases = Math.round((purchasesAgg[0]?.total || 0) * 100) / 100;
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
