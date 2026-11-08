import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { SupplyInvoice, Supplier, Product } from '../types';
import {
  ShoppingBag,
  Search,
  Plus,
  Coins,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { downloadCsv } from '../utils/csvExport';

export const SupplyInvoicesPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [invoices, setInvoices] = useState<SupplyInvoice[]>([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    cashTotal: 0,
    creditTotal: 0,
    chequeTotal: 0,
  });

  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [isCustomSupplier, setIsCustomSupplier] = useState(false);

  // Form Fields
  const [formInvoiceNo, setFormInvoiceNo] = useState('');
  const [formSupplierCode, setFormSupplierCode] = useState('');
  const [formItemId, setFormItemId] = useState('');
  const [formBuyingPrice, setFormBuyingPrice] = useState<number | string>(0);
  const [formQuantity, setFormQuantity] = useState<number | string>(1);
  const [formPaymentStatus, setFormPaymentStatus] = useState<'Cash' | 'Credit' | 'Cheque'>('Cash');
  const [formChequeNo, setFormChequeNo] = useState('');
  const [formBankCode, setFormBankCode] = useState('');
  const [formBranchCode, setFormBranchCode] = useState('');
  const [formValueDate, setFormValueDate] = useState('');

  // Selection for batch settle
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchSupplyInvoices();
    fetchSuppliers();
  }, [search, paymentStatus]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliersList(res.data.suppliers || []);
    } catch (err) {
      console.error('Failed to load suppliers list', err);
    }
  };

  const fetchSupplyInvoices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (paymentStatus !== 'All') params.append('paymentStatus', paymentStatus);

      const res = await api.get(`/supply-invoices?${params.toString()}`);
      setInvoices(res.data.invoices || []);
      if (res.data.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Failed to load supply invoices', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = async () => {
    setFormInvoiceNo('');
    setFormSupplierCode('');
    setIsCustomSupplier(false);
    setFormItemId('');
    setFormBuyingPrice(0);
    setFormQuantity(1);
    setFormPaymentStatus('Cash');
    setFormChequeNo('');
    setFormBankCode('');
    setFormBranchCode('');
    setFormValueDate('');
    setIsModalOpen(true);
    fetchSuppliers();
  };

  // Auto-fill buying price and supplier code if item found
  const handleItemIdBlur = async () => {
    if (!formItemId.trim()) return;
    try {
      const res = await api.get(`/inventory/lookup?itemId=${formItemId.trim().toUpperCase()}`);
      if (res.data?.product) {
        setFormBuyingPrice(res.data.product.buyingPrice || 0);
        if (res.data.product.supplierCode && !formSupplierCode) {
          const matchedCode = res.data.product.supplierCode.toUpperCase();
          setFormSupplierCode(matchedCode);
          if (!suppliersList.some((s) => s.supplierCode.toUpperCase() === matchedCode)) {
            setIsCustomSupplier(true);
          }
        }
      }
    } catch {
      // Ignore
    }
  };

  // Active supplier object matching currently selected/typed supplier code
  const selectedSupplier = useMemo(() => {
    if (!formSupplierCode.trim()) return null;
    return (
      suppliersList.find(
        (s) => s.supplierCode.toUpperCase() === formSupplierCode.trim().toUpperCase()
      ) || null
    );
  }, [suppliersList, formSupplierCode]);

  // Invoice suggestions derived from supplier table memo/invoices and past purchases
  const invoiceSuggestions = useMemo(() => {
    const list: { code: string; label: string; supplierCode?: string }[] = [];
    const seen = new Set<string>();

    const addSuggestion = (code: string, label: string, supCode?: string) => {
      const clean = code.trim();
      if (!clean) return;
      const key = clean.toUpperCase();
      if (seen.has(key)) return;
      seen.add(key);
      list.push({ code: clean, label, supplierCode: supCode });
    };

    if (selectedSupplier) {
      // 1. From Supplier Table "invoice" (Memo / Invoices) field
      if (selectedSupplier.invoice && selectedSupplier.invoice.trim()) {
        const raw = selectedSupplier.invoice.trim();
        const parts = raw
          .split(/[,;\n|/]+/)
          .map((p) => p.trim())
          .filter(Boolean);

        parts.forEach((p) => {
          addSuggestion(p, 'Memo', selectedSupplier.supplierCode);
        });

        if (!seen.has(raw.toUpperCase()) && raw.length <= 30) {
          addSuggestion(raw, 'Memo', selectedSupplier.supplierCode);
        }
      }

      // 2. From historical supply invoices for this supplier
      invoices
        .filter((inv) => inv.supplierCode.toUpperCase() === selectedSupplier.supplierCode.toUpperCase())
        .forEach((inv) => {
          addSuggestion(inv.invoiceNo, 'Past', selectedSupplier.supplierCode);
        });
    } else {
      // If no supplier is chosen yet, suggest from all suppliers' memo/invoices in the supplier table
      suppliersList.forEach((s) => {
        if (s.invoice && s.invoice.trim()) {
          const parts = s.invoice
            .split(/[,;\n|/]+/)
            .map((p) => p.trim())
            .filter(Boolean);

          parts.forEach((p) => {
            addSuggestion(p, s.supplierCode, s.supplierCode);
          });
        }
      });

      // Also include recent supply invoices
      invoices.slice(0, 10).forEach((inv) => {
        addSuggestion(inv.invoiceNo, inv.supplierCode, inv.supplierCode);
      });
    }

    return list;
  }, [selectedSupplier, suppliersList, invoices, formSupplierCode]);

  const handleSaveSupplyInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInvoiceNo.trim() || !formSupplierCode.trim() || !formItemId.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Invoice Number, Supplier Code, and Item ID are required.',
      });
      return;
    }

    const qty = Math.max(0, Number(formQuantity) || 0);
    if (qty <= 0) {
      setStatusMessage({ type: 'error', text: 'Quantity must be at least 1.' });
      return;
    }

    try {
      await api.post('/supply-invoices', {
        invoiceNo: formInvoiceNo.trim(),
        supplierCode: formSupplierCode.trim().toUpperCase(),
        itemId: formItemId.trim().toUpperCase(),
        buyingPrice: Math.max(0, Number(formBuyingPrice) || 0),
        quantity: qty,
        paymentStatus: formPaymentStatus,
        chequeNo: formChequeNo.trim(),
        bankCode: formBankCode.trim(),
        branchCode: formBranchCode.trim(),
        valueDate: formValueDate || null,
      });

      setStatusMessage({
        type: 'success',
        text: `Purchase ${formInvoiceNo} recorded and stock incremented!`,
      });
      setIsModalOpen(false);
      fetchSupplyInvoices();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to record purchase invoice.',
      });
    }
  };

  const handleBatchSettle = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.post('/supply-invoices/settle', { invoiceIds: selectedIds });
      setStatusMessage({
        type: 'success',
        text: `Successfully settled ${selectedIds.length} purchase invoices.`,
      });
      setSelectedIds([]);
      fetchSupplyInvoices();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to settle supply invoices.',
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportSupplyInvoicesCsv = () => {
    const headers = [
      'Invoice No',
      'Created Date',
      'Supplier Code',
      'Item ID',
      'Quantity',
      'Buying Price (LKR)',
      'Total Amount (LKR)',
      'Payment Status',
      'Settled',
      'Cheque / Value Date',
      'Cheque No',
    ];

    const rows = invoices.map((inv) => [
      inv.invoiceNo,
      new Date(inv.createdAt).toLocaleDateString(),
      inv.supplierCode,
      inv.itemId,
      inv.quantity,
      inv.buyingPrice,
      inv.total,
      inv.paymentStatus,
      inv.isSettled ? 'Yes' : 'No',
      inv.valueDate ? new Date(inv.valueDate).toLocaleDateString() : '',
      inv.chequeNo || '',
    ]);

    downloadCsv(`isuru_supply_invoices_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Supply Purchases &amp; Invoices</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log incoming vendor supply invoices, increment stock, and manage cheque maturity.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportSupplyInvoicesCsv}
            disabled={invoices.length === 0}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Export supply purchase invoices to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Purchase</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between text-xs font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Purchases Logged</span>
          <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">{invoices.length}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Total Purchases</span>
          <p className="text-base sm:text-xl font-black text-slate-900 mt-1 truncate">
            LKR {summary.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Credit Purchases</span>
          <p className="text-base sm:text-xl font-black text-rose-600 mt-1 truncate">
            LKR {summary.creditTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Cheques</span>
          <p className="text-base sm:text-xl font-black text-blue-600 mt-1 truncate">
            LKR {summary.chequeTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filter and Batch Action Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Invoice No, Supplier Code, Item ID..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Payment Status Dropdown */}
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

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
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-8 text-center"></th>
                <th className="px-4 py-3">Invoice No</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Item Code</th>
                <th className="px-4 py-3 text-center w-16">Qty</th>
                <th className="px-4 py-3 text-right">Cost (LKR)</th>
                <th className="px-4 py-3 text-right">Total (LKR)</th>
                <th className="px-4 py-3 text-center">Payment</th>
                <th className="px-4 py-3">Cheque Details</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                    No supply purchase invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center">
                      {!inv.isSettled && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(inv.id)}
                          onChange={() => toggleSelectOne(inv.id)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(inv.createdAt).toLocaleDateString('en-LK')}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">{inv.supplierCode}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{inv.itemId}</td>
                    <td className="px-4 py-3 text-center font-bold">{inv.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">
                      {inv.buyingPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-slate-900">
                      {inv.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{inv.paymentStatus}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {inv.chequeNo ? (
                        <div>
                          <p className="font-mono font-semibold text-slate-800">#{inv.chequeNo}</p>
                          <p>
                            Bank: {inv.bankCode || '—'} | Branch: {inv.branchCode || '—'}
                          </p>
                          {inv.valueDate && (
                            <p className="text-[10px] text-amber-700">
                              Val: {new Date(inv.valueDate).toLocaleDateString('en-LK')}
                            </p>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={inv.isSettled ? 'success' : 'warning'}>
                        {inv.isSettled ? 'Settled' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Supply Purchase Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Supply Purchase Invoice"
        subtitle="Increments stock count and tracks supplier accounts payable"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveSupplyInvoice} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supplier Code Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Supplier Code *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomSupplier((prev) => !prev)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  {isCustomSupplier ? 'Select from list' : '+ Type custom code'}
                </button>
              </div>

              {!isCustomSupplier ? (
                <select
                  required
                  value={formSupplierCode}
                  onChange={(e) => setFormSupplierCode(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="">
                    {suppliersList.length > 0
                      ? `-- Select Supplier (${suppliersList.length} registered) --`
                      : '-- No registered suppliers found --'}
                  </option>
                  {suppliersList.map((s) => (
                    <option key={s.id} value={s.supplierCode}>
                      {s.supplierCode} — {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={formSupplierCode}
                  onChange={(e) => setFormSupplierCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUP-0001"
                  className="w-full h-10 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              )}

              {selectedSupplier ? (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-800 truncate">
                    {selectedSupplier.name}
                  </span>
                  {selectedSupplier.contact && (
                    <span className="text-slate-500 font-mono text-[10px] shrink-0 ml-1">
                      📞 {selectedSupplier.contact}
                    </span>
                  )}
                </div>
              ) : (
                <p className="mt-1.5 text-[10px] text-slate-400">
                  Select a registered supplier from the dropdown
                </p>
              )}
            </div>

            {/* Vendor Invoice No Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Vendor Invoice No *
                </label>
                {invoiceSuggestions.length > 0 && (
                  <span className="text-[10px] text-blue-600 font-medium">
                    {invoiceSuggestions.length} memo suggestion{invoiceSuggestions.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <input
                type="text"
                required
                value={formInvoiceNo}
                onChange={(e) => setFormInvoiceNo(e.target.value)}
                placeholder="e.g. UML-INV-9821"
                className="w-full h-10 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500 shadow-2xs"
              />

              {invoiceSuggestions.length > 0 && (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      const chosen = invoiceSuggestions.find(
                        (item) => item.code.toUpperCase() === e.target.value.toUpperCase()
                      );
                      setFormInvoiceNo(chosen ? chosen.code : e.target.value);
                      if (chosen?.supplierCode && !formSupplierCode) {
                        setFormSupplierCode(chosen.supplierCode);
                      }
                    }
                  }}
                  className="w-full h-9 px-3 py-1.5 border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  title="Pick from supplier memo suggestions"
                >
                  <option value="">
                    -- Pick from Supplier Memo ({invoiceSuggestions.length}) --
                  </option>
                  {invoiceSuggestions.map((item, idx) => (
                    <option key={idx} value={item.code}>
                      {item.code}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item ID *
              </label>
              <input
                type="text"
                required
                value={formItemId}
                onChange={(e) => setFormItemId(e.target.value.toUpperCase())}
                onBlur={handleItemIdBlur}
                placeholder="e.g. MOB-0001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Buying Unit Price (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formBuyingPrice}
                onChange={(e) => setFormBuyingPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-right bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formQuantity}
                onChange={(e) => setFormQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-center bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method
            </label>
            <select
              value={formPaymentStatus}
              onChange={(e) => setFormPaymentStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {formPaymentStatus === 'Cheque' && (
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/60 space-y-3">
              <h5 className="text-[11px] font-bold text-blue-900 uppercase">Cheque Details</h5>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Cheque Number
                  </label>
                  <input
                    type="text"
                    value={formChequeNo}
                    onChange={(e) => setFormChequeNo(e.target.value)}
                    placeholder="e.g. 782103"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Value / Maturity Date
                  </label>
                  <input
                    type="date"
                    value={formValueDate}
                    onChange={(e) => setFormValueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Bank Code
                  </label>
                  <input
                    type="text"
                    value={formBankCode}
                    onChange={(e) => setFormBankCode(e.target.value)}
                    placeholder="e.g. 7010 (BOC)"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    value={formBranchCode}
                    onChange={(e) => setFormBranchCode(e.target.value)}
                    placeholder="e.g. 021"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              Record &amp; Increment Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

