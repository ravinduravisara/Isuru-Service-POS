import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Customer, Vehicle, Service, VehicleType, PaymentMethod, Invoice } from '../types';
import {
  Receipt,
  Search,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  User,
  Car,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { InvoicePrintModal } from '../components/printing/InvoicePrintModal';

interface BillingRow {
  service: string;
  itemId: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

const VEHICLE_TYPES: VehicleType[] = ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Credit', 'Card', 'Cheque'];

export const BillingPage: React.FC = () => {
  // Customer & Vehicle State
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isManualCustomer, setIsManualCustomer] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [customerVehicles, setCustomerVehicles] = useState<Vehicle[]>([]);

  // Services catalog for selected vehicle category
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  // Billing Line Items
  const [rows, setRows] = useState<BillingRow[]>([
    { service: '', itemId: '', description: '', qty: 1, rate: 0, amount: 0 },
  ]);

  // Settlement & Calculations
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  // Status & UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Business profile for printing header
  const [businessProfile, setBusinessProfile] = useState<{
    name: string;
    address: string;
    phone: string;
  }>({
    name: 'ISURU Service Center',
    address: 'Main Street, Colombo, Sri Lanka',
    phone: '+94 77 123 4567',
  });

  // Load business profile and services
  useEffect(() => {
    fetchBusinessProfile();
  }, []);

  useEffect(() => {
    fetchServicesForCategory(vehicleType);
  }, [vehicleType]);

  const fetchBusinessProfile = async () => {
    try {
      const res = await api.get('/settings/profile');
      if (res.data?.profile) {
        setBusinessProfile({
          name: res.data.profile.businessName || 'ISURU Service Center',
          address: res.data.profile.address || '',
          phone: res.data.profile.phone || '',
        });
      }
    } catch {
      // Keep defaults
    }
  };

  const fetchServicesForCategory = async (cat: VehicleType) => {
    try {
      const res = await api.get(`/services?category=${cat}`);
      setAvailableServices(res.data.services || []);
    } catch (err) {
      console.error('Failed to load services for category:', cat, err);
    }
  };

  // Customer search handler
  useEffect(() => {
    if (!customerSearchQuery.trim() || selectedCustomer) {
      setCustomerSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/customers/search?q=${encodeURIComponent(customerSearchQuery)}`);
        setCustomerSearchResults(res.data.customers || []);
        setIsCustomerDropdownOpen(true);
      } catch (err) {
        console.error('Customer search failed', err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [customerSearchQuery, selectedCustomer]);

  const handleSelectCustomer = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setCustomerName(cust.name);
    setCustomerPhone(cust.phone || '');
    setCustomerSearchQuery(cust.name);
    setIsCustomerDropdownOpen(false);

    // Fetch vehicles for this customer
    try {
      const res = await api.get(`/customers/${cust.id}/vehicles`);
      const vList: Vehicle[] = res.data.vehicles || [];
      setCustomerVehicles(vList);
      if (vList.length > 0) {
        setVehicleNo(vList[0].vehicleNo);
        setVehicleType(vList[0].vehicleType);
      }
    } catch (err) {
      console.error('Failed to load customer vehicles', err);
    }
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerSearchQuery('');
    setCustomerVehicles([]);
    setVehicleNo('');
    setIsManualCustomer(false);
  };

  // Row Manipulation
  const handleAddRow = useCallback(() => {
    setRows((prev) => [...prev, { service: '', itemId: '', description: '', qty: 1, rate: 0, amount: 0 }]);
  }, []);

  const handleRemoveRow = (index: number) => {
    if (rows.length === 1) {
      setRows([{ service: '', itemId: '', description: '', qty: 1, rate: 0, amount: 0 }]);
      return;
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleServiceSelect = (index: number, serviceName: string) => {
    const foundService = availableServices.find((s) => s.name === serviceName);
    setRows((prev) => {
      const updated = [...prev];
      const rate = foundService ? foundService.price : updated[index].rate;
      const desc = foundService?.description || updated[index].description;
      const amount = Math.round(updated[index].qty * rate * 100) / 100;
      updated[index] = {
        ...updated[index],
        service: serviceName,
        rate,
        description: desc,
        amount,
      };
      return updated;
    });
  };

  // Lookup Product Item ID
  const handleItemIdChange = async (index: number, itemId: string) => {
    const upperId = itemId.trim().toUpperCase();
    setRows((prev) => {
      const updated = [...prev];
      updated[index].itemId = upperId;
      return updated;
    });

    if (upperId.length >= 3) {
      try {
        const res = await api.get(`/inventory/lookup?itemId=${upperId}`);
        if (res.data?.product) {
          const prod = res.data.product;
          setRows((prev) => {
            const updated = [...prev];
            const rate = prod.unitPrice || updated[index].rate;
            const desc = prod.brand ? `${prod.itemName} (${prod.brand})` : prod.itemName;
            const amount = Math.round(updated[index].qty * rate * 100) / 100;
            updated[index] = {
              ...updated[index],
              service: updated[index].service || prod.itemName,
              description: desc,
              rate,
              amount,
            };
            return updated;
          });
        }
      } catch {
        // Not found yet or network ignore
      }
    }
  };

  const handleRowChange = (
    index: number,
    field: 'service' | 'description' | 'qty' | 'rate',
    value: string | number
  ) => {
    setRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };
      const qty = Math.max(0, Number(row.qty) || 0);
      const rate = Math.max(0, Number(row.rate) || 0);
      row.amount = Math.round(qty * rate * 100) / 100;
      updated[index] = row;
      return updated;
    });
  };

  // Summary Calculations
  const subtotal = Math.round(rows.reduce((sum, r) => sum + (r.amount || 0), 0) * 100) / 100;
  const safeDiscount = Math.min(subtotal, Math.max(0, Number(discount) || 0));
  const grandTotal = Math.max(0, Math.round((subtotal - safeDiscount) * 100) / 100);

  // Submit Invoice
  const handleSubmitInvoice = useCallback(async () => {
    setErrorMessage('');
    setSuccessMessage('');

    const targetCustomerName = customerName.trim() || customerSearchQuery.trim();
    if (!targetCustomerName) {
      setErrorMessage('Please enter or select a customer name.');
      return;
    }
    if (!vehicleNo.trim()) {
      setErrorMessage('Please enter the vehicle registration number.');
      return;
    }

    const validRows = rows.filter((r) => r.service.trim() && r.amount > 0);
    if (validRows.length === 0) {
      setErrorMessage('Please add at least one service or item line with a valid price.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: selectedCustomer?.id,
        customerName: targetCustomerName,
        customerPhone: customerPhone.trim(),
        vehicleNo: vehicleNo.trim().toUpperCase(),
        vehicleType,
        items: validRows.map((r) => ({
          service: r.service.trim(),
          itemId: r.itemId.trim().toUpperCase() || undefined,
          description: r.description.trim(),
          qty: Number(r.qty) || 1,
          rate: Number(r.rate) || 0,
          amount: r.amount,
        })),
        discount: safeDiscount,
        paymentMethod,
      };

      const res = await api.post('/invoices', payload);
      if (res.data?.success && res.data?.invoice) {
        setCreatedInvoice(res.data.invoice);
        setIsPrintModalOpen(true);
        setSuccessMessage(`Invoice ${res.data.invoice.billNo} generated successfully!`);

        // Reset form for next billing
        handleResetForm();
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || 'Failed to generate invoice. Please check inputs.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    customerName,
    customerSearchQuery,
    selectedCustomer,
    customerPhone,
    vehicleNo,
    vehicleType,
    rows,
    safeDiscount,
    paymentMethod,
  ]);

  const handleResetForm = () => {
    setSelectedCustomer(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerSearchQuery('');
    setCustomerVehicles([]);
    setVehicleNo('');
    setRows([{ service: '', itemId: '', description: '', qty: 1, rate: 0, amount: 0 }]);
    setDiscount(0);
    setPaymentMethod('Cash');
    setErrorMessage('');
  };

  // Keyboard Shortcuts: Ctrl+S to save, F2 to add row
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSubmitInvoice();
      } else if (e.key === 'F2') {
        e.preventDefault();
        handleAddRow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmitInvoice, handleAddRow]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* POS Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-blue-600 text-white rounded-lg shadow-sm shrink-0">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Service Billing Counter</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              Live POS Terminal • Real-time Inventory Deduction &amp; Cost Freezing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-mono text-[11px]">
            <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-bold">F2</kbd> Add Item
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-mono text-[11px]">
            <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-bold">Ctrl+S</kbd> Save &amp; Print
          </span>
          <button
            onClick={handleResetForm}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-emerald-800 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          {createdInvoice && (
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="underline font-bold hover:text-emerald-900 cursor-pointer"
            >
              Re-open Print Preview
            </button>
          )}
        </div>
      )}

      {/* Customer & Vehicle Header Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Customer &amp; Vehicle Registration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Customer Lookup / Input */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name / Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedCustomer ? selectedCustomer.name : customerSearchQuery}
                onChange={(e) => {
                  if (selectedCustomer) setSelectedCustomer(null);
                  setCustomerSearchQuery(e.target.value);
                  setCustomerName(e.target.value);
                }}
                placeholder="Search or enter customer..."
                className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>

            {/* Dropdown search suggestions */}
            {isCustomerDropdownOpen && customerSearchResults.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {customerSearchResults.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => handleSelectCustomer(cust)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <p className="text-xs font-bold text-slate-800">{cust.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Phone: {cust.phone || 'No phone recorded'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 0771234567"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehicle Category
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehicle Number Plate
            </label>
            <input
              type="text"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
              placeholder="e.g. WP CAA-1234"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
            />
            {/* Quick Registered Vehicle Chips */}
            {customerVehicles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {customerVehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setVehicleNo(v.vehicleNo);
                      setVehicleType(v.vehicleType);
                    }}
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-mono transition-colors cursor-pointer ${
                      vehicleNo === v.vehicleNo
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    {v.vehicleNo} ({v.vehicleType})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill Line Items Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Service &amp; Inventory Line Items
            </h3>
            <span className="text-[11px] text-slate-500">
              ({rows.length} {rows.length === 1 ? 'row' : 'rows'})
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row (F2)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 w-10 text-center">#</th>
                <th className="px-4 py-2.5 w-60">Service / Labour</th>
                <th className="px-4 py-2.5 w-36">Item Code (Stock)</th>
                <th className="px-4 py-2.5">Description / Brand</th>
                <th className="px-4 py-2.5 w-20 text-center">Qty</th>
                <th className="px-4 py-2.5 w-28 text-right">Rate (LKR)</th>
                <th className="px-4 py-2.5 w-32 text-right">Amount (LKR)</th>
                <th className="px-4 py-2.5 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 text-center font-bold text-slate-400">{idx + 1}</td>

                  {/* Service selector */}
                  <td className="px-4 py-2.5">
                    <select
                      value={row.service}
                      onChange={(e) => handleServiceSelect(idx, e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Select Service --</option>
                      {availableServices.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} (LKR {s.price})
                        </option>
                      ))}
                      <option value="Custom Service / Part">Custom Service / Part</option>
                    </select>
                  </td>

                  {/* Item ID for Inventory Deduction */}
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      value={row.itemId}
                      onChange={(e) => handleItemIdChange(idx, e.target.value)}
                      placeholder="e.g. OIL-0001"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono uppercase focus:outline-none focus:border-blue-500 placeholder-slate-400"
                    />
                  </td>

                  {/* Description */}
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => handleRowChange(idx, 'description', e.target.value)}
                      placeholder="Specification or brand"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
                    />
                  </td>

                  {/* Qty */}
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => handleRowChange(idx, 'qty', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs text-center font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </td>

                  {/* Rate */}
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.rate}
                      onChange={(e) => handleRowChange(idx, 'rate', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs text-right font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </td>

                  {/* Amount (Read-only) */}
                  <td className="px-4 py-2.5 text-right font-bold text-slate-900 text-xs">
                    {row.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Delete row */}
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Settlement & Checkout Footer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Left: Notes & Payment Method Details */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Settlement Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === pm
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
            {paymentMethod === 'Credit' && (
              <p className="text-[11px] text-rose-600 mt-2 font-medium">
                * Note: This invoice will be recorded as pending credit on the customer's account ledger.
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-xs">
            <span className="font-bold text-slate-800">Automatic Stock Tracking:</span> If you entered an Item Code, the corresponding inventory record will automatically have its quantity decremented upon saving, and its current cost price will be frozen on this bill for accurate profit accounting.
          </div>
        </div>

        {/* Right: Totals & Save CTA */}
        <div className="lg:col-span-5 bg-slate-50/80 p-5 rounded-xl border border-slate-200/70 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-800 font-mono text-sm">
              LKR {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600">
            <label htmlFor="discount-input" className="cursor-pointer">
              Special Discount (LKR):
            </label>
            <input
              id="discount-input"
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
              className="w-28 px-2 py-1 text-right border border-slate-300 rounded font-semibold text-xs focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Grand Total:</span>
            <span className="text-xl font-black text-blue-600 font-mono">
              LKR {grandTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmitInvoice}
            disabled={isSubmitting || grandTotal <= 0}
            className="w-full mt-3 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>Save &amp; Print Invoice (Ctrl+S)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Print Preview & Receipt Modal */}
      {isPrintModalOpen && createdInvoice && (
        <InvoicePrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          invoice={createdInvoice}
          businessProfile={businessProfile}
        />
      )}
    </div>
  );
};

