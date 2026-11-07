import { Request, Response, NextFunction } from 'express';
import { Customer } from '../../models/Customer.js';
import { Vehicle } from '../../models/Vehicle.js';
import { Invoice } from '../../models/Invoice.js';
import { Product } from '../../models/Product.js';
import { Supplier } from '../../models/Supplier.js';

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
      Customer.countDocuments(),
      Vehicle.countDocuments(),
      Invoice.countDocuments(),
      Product.countDocuments(),
      Invoice.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Supplier.countDocuments(),
      Invoice.aggregate([
        {
          $match: {
            paymentMethod: { $regex: /^credit$/i },
            paymentStatus: { $ne: 'Paid' },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      Product.countDocuments({ quantity: { $lte: 5 } }),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const pendingCreditAmount = creditorsResult[0]?.total || 0;
    const pendingCreditCount = creditorsResult[0]?.count || 0;

    res.json({
      success: true,
      metrics: {
        customers: customersCount,
        vehicles: vehiclesCount,
        invoices: invoicesCount,
        inventoryItems: inventoryCount,
        revenue: totalRevenue,
        suppliers: suppliersCount,
        pendingCreditAmount,
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
    const invoices = await Invoice.find()
      .sort({ dateTime: -1, _id: -1 })
      .limit(8)
      .select('billNo customerName vehicleNo dateTime totalAmount paymentMethod paymentStatus');

    res.json({
      success: true,
      invoices,
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

    const dailyTrend = await Invoice.aggregate([
      { $match: { dateTime: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
          totalSales: { $sum: '$totalAmount' },
          invoiceCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          sales: '$totalSales',
          count: '$invoiceCount',
          _id: 0,
        },
      },
    ]);

    // Payment method distribution
    const paymentMethods = await Invoice.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          method: '$_id',
          total: '$totalAmount',
          count: '$count',
          _id: 0,
        },
      },
    ]);

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
