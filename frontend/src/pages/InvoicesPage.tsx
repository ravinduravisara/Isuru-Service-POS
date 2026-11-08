import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Invoice, PaymentMethod } from '../types';
import { offlineDb } from '../db/offlineDb';
import {
  FileText,
  Search,
  Filter,
  Printer,
  CheckCircle,
  Calendar,
  Coins,
  Receipt,
  Trash2,
  AlertCircle,
  ChevronDown,
  Download,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { InvoicePrintModal } from '../components/printing/InvoicePrintModal';
import { useAuthStore } from '../store/authStore';
import { downloadCsv } from '../utils/csvExport';

export const InvoicesPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState({
    count: 0,
    grandTotal: 0,
    cashTotal: 0,
    chequeTotal: 0,
    creditTotal: 0,
  });

  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('All');
  const [creditorsOnly, setCreditorsOnly] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [search, paymentMethod, creditorsOnly, fromDate, toDate]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (paymentMethod && paymentMethod !== 'All') params.append('paymentMethod', paymentMethod);
      if (creditorsOnly) params.append('creditorsOnly', 'true');
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      const res = await api.get(`/invoices?${params.toString()}`);
      setInvoices(res.data.invoices || []);
      if (res.data.summary) {
        setSummary(res.data.summary);
      }
      setIsOfflineMode(false);
    } catch (err) {
      console.warn('Network invoice fetch failed. Falling back to offline pending invoices:', err);
      setIsOfflineMode(true);
      try {
        const pending = await offlineDb.pendingInvoices.toArray();
        let filtered = pending;
        if (search.trim()) {
          const s = search.trim().toLowerCase();
          filtered = filtered.filter(
            (i) =>
              i.billNo.toLowerCase().includes(s) ||
              i.customerName.toLowerCase().includes(s) ||
              i.vehicleNo.toLowerCase().includes(s)
          );
        }
        if (paymentMethod && paymentMethod !== 'All') {
          filtered = filtered.filter((i) => i.paymentMethod === paymentMethod);
        }

        const mapped: Invoice[] = filtered.map((p) => ({
          id: p.id,
          billNo: p.finalBillNo || p.billNo,
          customerId: p.customerId || '',
          customerName: p.customerName,
          customerPhone: p.customerPhone,
          vehicleId: p.vehicleId || '',
          vehicleNo: p.vehicleNo,
          vehicleType: p.vehicleType,
          dateTime: p.dateTime,
          subtotalAmount: p.subtotalAmount,
          discountAmount: p.discountAmount,
          totalAmount: p.totalAmount,
          paymentMethod: p.paymentMethod as any,
          paymentStatus: p.paymentStatus as any,
          isProvisional: p.isProvisional,
          items: p.items.map((it) => ({
            service: it.service,
            itemId: it.itemId,
            description: it.description,
            qty: it.qty,
            rate: it.rate,
            amount: it.amount,
          })),
        }));

        setInvoices(mapped);
        const grandTotal = mapped.reduce((sum, i) => sum + i.totalAmount, 0);
        setSummary({
          count: mapped.length,
          grandTotal,
          cashTotal: mapped.filter((i) => i.paymentMethod === 'Cash').reduce((sum, i) => sum + i.totalAmount, 0),
          chequeTotal: mapped.filter((i) => i.paymentMethod === 'Cheque').reduce((sum, i) => sum + i.totalAmount, 0),
          creditTotal: mapped.filter((i) => i.paymentMethod === 'Credit').reduce((sum, i) => sum + i.totalAmount, 0),
        });
      } catch (dbErr) {
        console.error('Failed to load local offline invoices:', dbErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPrintModal = async (id: string) => {
    try {
      const res = await api.get(`/invoices/${id}`);
      setSelectedInvoice(res.data.invoice);
    } catch (err) {
      // Offline fallback: find in cached invoices or pending
      const foundPending = await offlineDb.pendingInvoices.get(id);
      if (foundPending) {
        setSelectedInvoice({
          id: foundPending.id,
          billNo: foundPending.finalBillNo || foundPending.billNo,
          customerId: foundPending.customerId || '',
          customerName: foundPending.customerName,
          customerPhone: foundPending.customerPhone,
          vehicleId: foundPending.vehicleId || '',
          vehicleNo: foundPending.vehicleNo,
          vehicleType: foundPending.vehicleType,
          dateTime: foundPending.dateTime,
          subtotalAmount: foundPending.subtotalAmount,
          discountAmount: foundPending.discountAmount,
          totalAmount: foundPending.totalAmount,
          paymentMethod: foundPending.paymentMethod as any,
          paymentStatus: foundPending.paymentStatus as any,
          isProvisional: foundPending.isProvisional,
          items: foundPending.items.map((it) => ({
            service: it.service,
            itemId: it.itemId,
            description: it.description,
            qty: it.qty,
            rate: it.rate,
            amount: it.amount,
          })),
        });
      } else {
        console.error('Failed to load invoice', err);
      }
    }
  };

  const handleSettleInvoice = async (id: string) => {
    try {
      await api.put(`/invoices/${id}/settle`);
      setActionMessage({ type: 'success', text: 'Invoice marked as settled (Paid).' });
      fetchInvoices();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to settle invoice.',
      });
    }
  };

  const handleBatchSettle = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => api.put(`/invoices/${id}/settle`)));
      setActionMessage({
        type: 'success',
        text: `Successfully settled ${selectedIds.length} credit invoices.`,
      });
      setSelectedIds([]);
      fetchInvoices();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: 'Failed to settle some invoices.',
      });
    }
  };

  const handleDeleteInvoice = async (id: string, billNo: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${billNo}?`)) return;
    try {
      await api.delete(`/invoices/${id}`);
      setActionMessage({ type: 'success', text: `Invoice ${billNo} deleted.` });
      fetchInvoices();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete invoice.',
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === invoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map((i) => i.id || (i as any)._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCsv = () => {
    const headers = [
      'Bill No',
      'Date & Time',
      'Customer Name',
      'Phone Number',
      'Vehicle No',
      'Vehicle Type',
      'Payment Method',
      'Payment Status',
      'Subtotal (LKR)',
      'Discount (LKR)',
      'Total Amount (LKR)',
      'Items Count',
    ];

    const rows = invoices.map((inv) => [
      inv.billNo,
      new Date(inv.dateTime).toLocaleString(),
      inv.customerName,
      inv.customerPhone,
      inv.vehicleNo,
      inv.vehicleType,
      inv.paymentMethod,
      inv.paymentStatus,
      inv.subtotalAmount,
      inv.discountAmount,
      inv.totalAmount,
      inv.items.length,
    ]);

    const filename = `isuru_invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Invoices &amp; Billing History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View, search, reprint past service bills, and manage outstanding credit receivables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={invoices.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Export filtered billing records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Tab Filters */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setCreditorsOnly(false)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                !creditorsOnly
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Invoices
            </button>
            <button
              onClick={() => setCreditorsOnly(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                creditorsOnly
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Unpaid Creditors</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between text-xs font-medium border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Filtered Bills</span>
          <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">{summary.count}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Total Billed</span>
          <p className="text-base sm:text-xl font-black text-slate-900 mt-1 truncate">
            LKR {summary.grandTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Cash &amp; Card Paid</span>
          <p className="text-base sm:text-xl font-black text-emerald-600 mt-1 truncate">
            LKR {summary.cashTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Pending Credit</span>
          <p className="text-base sm:text-xl font-black text-rose-600 mt-1 truncate">
            LKR {summary.creditTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Bill No, Customer, or Vehicle..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Payment Method Filter */}
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Card</option>
          </select>

          {/* Date range pickers */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 overflow-x-auto">
            <span className="text-slate-400 font-semibold text-[11px]">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 font-semibold text-[11px]">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Batch settle action */}
        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchSettle}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer w-full md:w-auto"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark {selectedIds.length} Settled</span>
          </button>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={invoices.length > 0 && selectedIds.length === invoices.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3">Bill No</th>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Amount (LKR)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const id = inv.id || (inv as any)._id;
                  const isCreditUnpaid =
                    inv.paymentMethod?.toLowerCase() === 'credit' &&
                    inv.paymentStatus?.toLowerCase() !== 'paid';

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        selectedIds.includes(id) ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(id)}
                          onChange={() => toggleSelectOne(id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => handleOpenPrintModal(id)}>
                        {inv.billNo}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(inv.dateTime).toLocaleString('en-LK', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{inv.customerName}</p>
                        {inv.customerPhone && (
                          <p className="text-[11px] text-slate-500 font-mono">{inv.customerPhone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 text-[11px] font-semibold">
                          {inv.vehicleNo}
                        </span>
                        <span className="block text-[10px] text-slate-400">{inv.vehicleType}</span>
                      </td>
                      <td className="px-4 py-3 font-medium">{inv.paymentMethod}</td>
                      <td className="px-4 py-3 text-right font-black text-slate-900">
                        {inv.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={
                            inv.paymentStatus?.toLowerCase() === 'paid'
                              ? 'success'
                              : 'warning'
                          }
                        >
                          {inv.paymentStatus || 'Paid'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isCreditUnpaid && (
                            <button
                              onClick={() => handleSettleInvoice(id)}
                              title="Mark as Settled"
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded text-[11px] transition-colors cursor-pointer"
                            >
                              Settle
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenPrintModal(id)}
                            title="Print / View Invoice"
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin() && (
                            <button
                              onClick={() => handleDeleteInvoice(id, inv.billNo)}
                              title="Delete Invoice"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Print & Preview Modal */}
      {selectedInvoice && (
        <InvoicePrintModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
};

