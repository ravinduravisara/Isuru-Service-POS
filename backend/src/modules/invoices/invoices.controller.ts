import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Invoice } from '../../models/Invoice.js';
import { Customer } from '../../models/Customer.js';
import { Vehicle } from '../../models/Vehicle.js';
import { Product } from '../../models/Product.js';
import { StockMovement } from '../../models/StockMovement.js';

export async function createInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      customerId: inputCustomerId,
      customerName,
      customerPhone = '',
      vehicleId: inputVehicleId,
      vehicleNo,
      vehicleType = 'Others',
      items,
      discount = 0,
      paymentMethod = 'Cash',
      billNo: customBillNo,
    } = req.body;

    if (!customerName || !customerName.trim()) {
      res.status(400).json({ success: false, error: 'Customer name is required.' });
      return;
    }
    if (!vehicleNo || !vehicleNo.trim()) {
      res.status(400).json({ success: false, error: 'Vehicle number is required.' });
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'At least one invoice item is required.' });
      return;
    }

    // 1. Resolve or Create Customer
    let customer = null;
    if (inputCustomerId && mongoose.Types.ObjectId.isValid(inputCustomerId)) {
      customer = await Customer.findById(inputCustomerId);
    }
    if (!customer) {
      const cleanPhone = (customerPhone || '').replace(/\D/g, '');
      customer = await Customer.findOne({
        name: customerName.trim(),
        ...(cleanPhone && { phone: cleanPhone }),
      });
      if (!customer) {
        customer = await Customer.create({
          name: customerName.trim(),
          phone: cleanPhone,
        });
      }
    }

    // 2. Resolve or Create Vehicle
    const cleanVehNo = vehicleNo.trim().toUpperCase();
    let vehicle = null;
    if (inputVehicleId && mongoose.Types.ObjectId.isValid(inputVehicleId)) {
      vehicle = await Vehicle.findById(inputVehicleId);
    }
    if (!vehicle) {
      vehicle = await Vehicle.findOne({
        customerId: customer._id,
        vehicleNo: cleanVehNo,
      });
      if (!vehicle) {
        vehicle = await Vehicle.create({
          customerId: customer._id,
          vehicleNo: cleanVehNo,
          vehicleType: vehicleType || 'Others',
        });
      }
    }

    // 3. Process Line Items and Real-time Stock Deduction
    const processedItems: any[] = [];
    let subtotal = 0;
    const now = new Date();

    for (const rawItem of items) {
      const service = (rawItem.service || '').trim();
      if (!service) continue;

      const qty = Math.max(0, Number(rawItem.qty) || 1);
      const rate = Math.max(0, Number(rawItem.rate) || 0);
      const amount = Math.round(qty * rate * 100) / 100;
      const itemId = (rawItem.itemId || '').trim().toUpperCase();
      const description = (rawItem.description || '').trim();

      let buyingPrice = 0;

      // If item has inventory item ID, deduct stock and snapshot buying price
      if (itemId) {
        const product = await Product.findOne({ itemId });
        if (product) {
          buyingPrice = product.buyingPrice || 0;
          // Deduct quantity without going below zero
          product.quantity = Math.max(0, product.quantity - qty);
          product.updatedAt = now;
          await product.save();

          // Record stock movement (negative quantity for sale deduction)
          await StockMovement.create({
            itemId,
            supplierCode: product.supplierCode || '',
            quantity: -qty,
            unitPrice: rate,
            buyingPrice,
            paymentMethod,
            movedAt: now,
          });
        }
      }

      subtotal += amount;
      processedItems.push({
        service,
        itemId,
        description,
        qty,
        rate,
        amount,
        buyingPrice,
      });
    }

    if (processedItems.length === 0) {
      res.status(400).json({ success: false, error: 'Please add at least one valid invoice row with an amount.' });
      return;
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const discountNum = Math.min(subtotal, Math.max(0, Number(discount) || 0));
    const totalAmount = Math.max(0, Math.round((subtotal - discountNum) * 100) / 100);

    // 4. Generate unique bill number
    let billNo = customBillNo?.trim();
    if (!billNo) {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timestamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
      billNo = `INV-${timestamp}`;
    }

    // 5. Payment Status
    let paymentStatus: 'Paid' | 'Pending' | 'unpaid' = 'Paid';
    if (paymentMethod.toLowerCase() === 'credit') {
      paymentStatus = 'unpaid';
    } else if (paymentMethod.toLowerCase() === 'cheque') {
      paymentStatus = 'Pending';
    }

    // 6. Create Invoice
    const invoice = await Invoice.create({
      billNo,
      customerId: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      vehicleId: vehicle._id,
      vehicleNo: vehicle.vehicleNo,
      vehicleType: vehicle.vehicleType,
      dateTime: now,
      subtotalAmount: subtotal,
      discountAmount: discountNum,
      totalAmount,
      paymentMethod,
      paymentStatus,
      items: processedItems,
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully.',
      invoice: {
        id: invoice._id,
        billNo: invoice.billNo,
        dateTime: invoice.dateTime,
        customerName: invoice.customerName,
        customerPhone: invoice.customerPhone,
        vehicleNo: invoice.vehicleNo,
        vehicleType: invoice.vehicleType,
        subtotalAmount: invoice.subtotalAmount,
        discountAmount: invoice.discountAmount,
        totalAmount: invoice.totalAmount,
        paymentMethod: invoice.paymentMethod,
        paymentStatus: invoice.paymentStatus,
        items: invoice.items,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';
    const paymentMethod = (req.query.paymentMethod as string)?.trim() || '';
    const creditorsOnly = req.query.creditorsOnly === 'true';
    const fromStr = req.query.from as string;
    const toStr = req.query.to as string;

    const filter: any = {};

    // Date range
    if (fromStr || toStr) {
      filter.dateTime = {};
      if (fromStr) {
        const fromDate = new Date(fromStr);
        fromDate.setHours(0, 0, 0, 0);
        filter.dateTime.$gte = fromDate;
      }
      if (toStr) {
        const toDate = new Date(toStr);
        toDate.setHours(23, 59, 59, 999);
        filter.dateTime.$lte = toDate;
      }
    }

    if (search) {
      filter.$or = [
        { billNo: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { vehicleNo: { $regex: search, $options: 'i' } },
      ];
    }

    if (paymentMethod && paymentMethod !== 'All') {
      filter.paymentMethod = new RegExp(`^${paymentMethod}$`, 'i');
    }

    if (creditorsOnly) {
      filter.paymentMethod = { $regex: /^credit$/i };
      filter.paymentStatus = { $ne: 'Paid' };
    }

    const invoices = await Invoice.find(filter).sort({ dateTime: -1, _id: -1 });

    let cashTotal = 0;
    let chequeTotal = 0;
    let creditTotal = 0;
    let grandTotal = 0;

    const formatted = invoices.map((inv) => {
      grandTotal += inv.totalAmount;
      if (inv.paymentMethod.toLowerCase() === 'cash' || inv.paymentMethod.toLowerCase() === 'card') {
        cashTotal += inv.totalAmount;
      } else if (inv.paymentMethod.toLowerCase() === 'cheque') {
        chequeTotal += inv.totalAmount;
      } else if (inv.paymentMethod.toLowerCase() === 'credit') {
        creditTotal += inv.totalAmount;
      }

      return {
        id: inv._id,
        billNo: inv.billNo,
        customerName: inv.customerName,
        customerPhone: inv.customerPhone,
        vehicleNo: inv.vehicleNo,
        vehicleType: inv.vehicleType,
        dateTime: inv.dateTime,
        subtotalAmount: inv.subtotalAmount,
        discountAmount: inv.discountAmount,
        totalAmount: inv.totalAmount,
        paymentMethod: inv.paymentMethod,
        paymentStatus: inv.paymentStatus,
        paymentSettledAt: inv.paymentSettledAt,
        itemsCount: inv.items.length,
      };
    });

    res.json({
      success: true,
      invoices: formatted,
      summary: {
        totalInvoices: invoices.length,
        grandTotal,
        cashTotal,
        chequeTotal,
        creditTotal,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    let invoice = null;

    const paramId = Array.isArray(id) ? id[0] : id;
    if (paramId && mongoose.Types.ObjectId.isValid(paramId)) {
      invoice = await Invoice.findById(paramId);
    } else if (paramId) {
      invoice = await Invoice.findOne({ billNo: paramId });
    }

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found.' });
      return;
    }

    res.json({
      success: true,
      invoice: {
        id: invoice._id,
        billNo: invoice.billNo,
        dateTime: invoice.dateTime,
        customerName: invoice.customerName,
        customerPhone: invoice.customerPhone,
        vehicleNo: invoice.vehicleNo,
        vehicleType: invoice.vehicleType,
        subtotalAmount: invoice.subtotalAmount,
        discountAmount: invoice.discountAmount,
        totalAmount: invoice.totalAmount,
        paymentMethod: invoice.paymentMethod,
        paymentStatus: invoice.paymentStatus,
        paymentSettledAt: invoice.paymentSettledAt,
        items: invoice.items,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function settleInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { invoiceIds } = req.body;
    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      res.status(400).json({ success: false, error: 'Array of invoice IDs is required.' });
      return;
    }

    const now = new Date();
    await Invoice.updateMany(
      {
        _id: { $in: invoiceIds },
        paymentMethod: { $regex: /^credit$/i },
        paymentStatus: { $ne: 'Paid' },
      },
      {
        $set: {
          paymentStatus: 'Paid',
          paymentSettledAt: now,
        },
      }
    );

    res.json({
      success: true,
      message: `${invoiceIds.length} credit invoice(s) marked as settled.`,
    });
  } catch (error) {
    next(error);
  }
}

export async function settleInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const now = new Date();
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      {
        $set: {
          paymentStatus: 'Paid',
          paymentSettledAt: now,
        },
      },
      { new: true }
    );

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Invoice ${invoice.billNo} marked as settled.`,
      invoice,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found.' });
      return;
    }

    // Restore stock for inventory items sold on this invoice
    for (const item of invoice.items) {
      if (item.itemId) {
        await Product.findOneAndUpdate(
          { itemId: item.itemId.trim().toUpperCase() },
          { $inc: { quantity: item.qty }, $set: { updatedAt: new Date() } }
        );
      }
    }

    await Invoice.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Invoice ${invoice.billNo} deleted and inventory quantities restored.`,
    });
  } catch (error) {
    next(error);
  }
}
