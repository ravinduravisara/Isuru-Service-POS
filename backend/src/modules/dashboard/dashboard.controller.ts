import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export async function getDashboardMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [
      customersCount,
      vehiclesCount,
      invoicesCount,
      inventoryCount,
      revenueResult,
      suppliersCount,
      creditorsResult,
      lowStockCount,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.vehicle.count(),
      prisma.invoice.count(),
      prisma.product.count(),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.supplier.count(),
      prisma.invoice.aggregate({
        where: {
          paymentMethod: { equals: 'Credit', mode: 'insensitive' },
          paymentStatus: { not: 'Paid' },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.product.count({
        where: { quantity: { lte: 5 } },
      }),
    ]);

    const totalRevenue = Number(revenueResult._sum.totalAmount || 0);
    const pendingCreditAmount = Number(creditorsResult._sum.totalAmount || 0);
    const pendingCreditCount = creditorsResult._count || 0;

    res.json({
      success: true,
      metrics: {
        customers: customersCount,
        vehicles: vehiclesCount,
        invoices: invoicesCount,
        inventoryItems: inventoryCount,
        revenue: Math.round(totalRevenue * 100) / 100,
        suppliers: suppliersCount,
        pendingCreditAmount: Math.round(pendingCreditAmount * 100) / 100,
        pendingCreditCount,
        lowStockItems: lowStockCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecentInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const invoices = await prisma.invoice.findMany({
      take: 8,
      orderBy: [{ dateTime: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        billNo: true,
        customerName: true,
        vehicleNo: true,
        dateTime: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
      },
    });

    res.json({
      success: true,
      invoices: invoices.map((inv) => ({
        id: inv.id,
        _id: inv.id,
        billNo: inv.billNo,
        customerName: inv.customerName,
        vehicleNo: inv.vehicleNo,
        dateTime: inv.dateTime,
        totalAmount: Number(inv.totalAmount),
        paymentMethod: inv.paymentMethod,
        paymentStatus: inv.paymentStatus,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getSalesCharts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 30 days daily sales trend
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const invoices = await prisma.invoice.findMany({
      where: {
        dateTime: { gte: thirtyDaysAgo },
      },
      select: {
        dateTime: true,
        totalAmount: true,
        paymentMethod: true,
      },
      orderBy: { dateTime: 'asc' },
    });

    const trendMap = new Map<string, { totalSales: number; invoiceCount: number }>();
    const paymentMap = new Map<string, { total: number; count: number }>();

    for (const inv of invoices) {
      const dateKey = inv.dateTime.toISOString().split('T')[0];
      const amount = Number(inv.totalAmount);

      // Trend
      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, { totalSales: 0, invoiceCount: 0 });
      }
      const t = trendMap.get(dateKey)!;
      t.totalSales += amount;
      t.invoiceCount += 1;

      // Payment
      const pm = inv.paymentMethod || 'Cash';
      if (!paymentMap.has(pm)) {
        paymentMap.set(pm, { total: 0, count: 0 });
      }
      const p = paymentMap.get(pm)!;
      p.total += amount;
      p.count += 1;
    }

    const dailyTrend = Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      sales: Math.round(data.totalSales * 100) / 100,
      count: data.invoiceCount,
    }));

    const paymentMethods = Array.from(paymentMap.entries()).map(([method, data]) => ({
      method,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
    }));

    res.json({
      success: true,
      charts: {
        dailyTrend,
        paymentMethods,
      },
    });
  } catch (error) {
    next(error);
  }
}
