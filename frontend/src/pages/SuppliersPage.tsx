import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Supplier } from '../types';
import {
  Truck,
  Search,
  Plus,
  Coins,
  DollarSign,
  Phone,
  FileText,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  Check,
  AlertCircle,
  Download,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { downloadCsv } from '../utils/csvExport';

export const SuppliersPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formInvoice, setFormInvoice] = useState('');

  // Movements / Settlement Modal State
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [movementSummary, setMovementSummary] = useState({ totalAmount: 0, unsettledAmount: 0 });
  const [selectedMovements, setSelectedMovements] = useState<string[]>([]);
  const [isMovementsLoading, setIsMovementsLoading] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Inline memo editing state: supplierId -> draft text
  const [memoDrafts, setMemoDrafts] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/suppliers?search=${encodeURIComponent(search.trim())}`);
      const list: Supplier[] = res.data.suppliers || [];
      setSuppliers(list);

      const drafts: { [id: string]: string } = {};
      list.forEach((s) => {
        drafts[s.id] = s.invoice || '';
      });
      setMemoDrafts(drafts);
    } catch (err) {
      console.error('Failed to load suppliers', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    setFormCode('');
    setFormName('');
    setFormContact('');
    setFormInvoice('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setFormCode(s.supplierCode);
    setFormName(s.name);
    setFormContact(s.contact);
    setFormInvoice(s.invoice || '');
    setIsModalOpen(true);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setStatusMessage({ type: 'error', text: 'Supplier name is required.' });
      return;
    }

    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, {
          name: formName.trim(),
          contact: formContact.trim(),
          invoice: formInvoice.trim(),
        });
        setStatusMessage({ type: 'success', text: 'Supplier updated successfully.' });
      } else {
        await api.post('/suppliers', {
          supplierCode: formCode.trim().toUpperCase() || undefined,
          name: formName.trim(),
          contact: formContact.trim(),
          invoice: formInvoice.trim(),
        });
        setStatusMessage({ type: 'success', text: 'Supplier created successfully.' });
      }

      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to save supplier.',
      });
    }
  };

  const handleDeleteSupplier = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete supplier "${name}"?`)) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setStatusMessage({ type: 'success', text: `Supplier "${name}" deleted.` });
      fetchSuppliers();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete supplier.',
      });
    }
  };

  const handleSaveMemo = async (id: string) => {
    try {
      await api.put(`/suppliers/${id}/invoice`, { invoice: memoDrafts[id] || '' });
      setStatusMessage({ type: 'success', text: 'Supplier invoice memo saved.' });
      fetchSuppliers();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to save memo.',
      });
    }
  };

  const handleOpenMovements = async (s: Supplier) => {
    setActiveSupplier(s);
    setIsMovementsLoading(true);
    setSelectedMovements([]);
    try {
      const res = await api.get(`/suppliers/${s.supplierCode}/movements`);
      setMovements(res.data.movements || []);
      setMovementSummary(res.data.summary || { totalAmount: 0, unsettledAmount: 0 });
    } catch (err) {
      console.error('Failed to load supplier movements', err);
    } finally {
      setIsMovementsLoading(false);
    }
  };

  const handleSettleMovements = async () => {
    if (selectedMovements.length === 0 || !activeSupplier) return;
    try {
      await api.post('/suppliers/settle', { movementIds: selectedMovements });
      setStatusMessage({
        type: 'success',
        text: `Successfully settled ${selectedMovements.length} purchases.`,
      });
      // Refresh movements and suppliers
      handleOpenMovements(activeSupplier);
      fetchSuppliers();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to settle items.',
      });
    }
  };

  // Aggregated totals across all suppliers
  const totalCash = suppliers.reduce((sum, s) => sum + (s.cashTotal || 0), 0);
  const totalCredit = suppliers.reduce((sum, s) => sum + (s.creditTotal || 0), 0);
  const totalCheque = suppliers.reduce((sum, s) => sum + (s.chequeTotal || 0), 0);

  const handleExportSuppliersCsv = () => {
    const headers = [
      'Supplier Code',
      'Supplier Name',
      'Contact Info',
      'Cash Total (LKR)',
      'Pending Credit (LKR)',
      'Cheque Total (LKR)',
      'Invoice / Memo',
    ];

    const rows = suppliers.map((s) => [
      s.supplierCode,
      s.name,
      s.contact || '',
      s.cashTotal || 0,
      s.creditTotal || 0,
      s.chequeTotal || 0,
      s.invoice || '',
    ]);

    downloadCsv(`isuru_suppliers_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Supplier Ledger &amp; Payables</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage vendor profiles, purchase accounts, credit balances, and payment settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportSuppliersCsv}
            disabled={suppliers.length === 0}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Export supplier ledger to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Supplier</span>
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
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Registered Suppliers</span>
          <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">{suppliers.length}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Cash Purchases</span>
          <p className="text-base sm:text-xl font-black text-emerald-600 mt-1 truncate">
            LKR {totalCash.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Credit Payable</span>
          <p className="text-base sm:text-xl font-black text-rose-600 mt-1 truncate">
            LKR {totalCredit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Cheques</span>
          <p className="text-base sm:text-xl font-black text-blue-600 mt-1 truncate">
            LKR {totalCheque.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by supplier code, name, or contact number..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-28">Code</th>
                <th className="px-5 py-3">Supplier Name</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Cash Purchases</th>
                <th className="px-5 py-3 text-right">Credit Balance</th>
                <th className="px-5 py-3 text-right">Cheques</th>
                <th className="px-5 py-3 w-48">Memo / Invoices</th>
                <th className="px-5 py-3 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No suppliers found matching your query.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{s.supplierCode}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{s.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">{s.contact || '—'}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                      {s.cashTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-rose-600">
                      {s.creditTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                      {s.chequeTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    {/* Inline Memo */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={memoDrafts[s.id] ?? s.invoice ?? ''}
                          onChange={(e) =>
                            setMemoDrafts({ ...memoDrafts, [s.id]: e.target.value })
                          }
                          placeholder="Note / Inv #"
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-blue-500 focus:outline-none bg-white"
                        />
                        {memoDrafts[s.id] !== s.invoice && (
                          <button
                            onClick={() => handleSaveMemo(s.id)}
                            title="Save Memo"
                            className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenMovements(s)}
                          title="View Ledger & Settle"
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ledger</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          title="Edit Supplier"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin() && (
                          <button
                            onClick={() => handleDeleteSupplier(s.id, s.name)}
                            title="Delete Supplier"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Supplier Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}
        subtitle="Manage supplier profile and purchase ledger code"
      >
        <form onSubmit={handleSaveSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier Code (Optional auto-generate SUP-000X)
            </label>
            <input
              type="text"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUP-0001"
              disabled={!!editingSupplier}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier / Company Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. United Motors Lanka"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Telephone / Mobile
            </label>
            <input
              type="text"
              value={formContact}
              onChange={(e) => setFormContact(e.target.value)}
              placeholder="e.g. 011-2345678"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Invoice Memo / Reference
            </label>
            <input
              type="text"
              value={formInvoice}
              onChange={(e) => setFormInvoice(e.target.value)}
              placeholder="e.g. Account Ref #094"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

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
              {editingSupplier ? 'Save Changes' : 'Register Supplier'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Supplier Movements & Settlement Modal */}
      {activeSupplier && (
        <Modal
          isOpen={!!activeSupplier}
          onClose={() => setActiveSupplier(null)}
          title={`Purchases Ledger: ${activeSupplier.name}`}
          subtitle={`Supplier Code: ${activeSupplier.supplierCode}`}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            {/* Ledger summary & batch settle button */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Total Purchases:</span>{' '}
                  <span className="font-bold text-slate-900 font-mono">
                    LKR {movementSummary.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Unsettled:</span>{' '}
                  <span className="font-bold text-rose-600 font-mono">
                    LKR {movementSummary.unsettledAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {selectedMovements.length > 0 && (
                <button
                  onClick={handleSettleMovements}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Settle {selectedMovements.length} Items</span>
                </button>
              )}
            </div>

            {/* Movements Table */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 w-8 text-center"></th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Item Code</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Buying Price</th>
                    <th className="px-3 py-2 text-right">Total (LKR)</th>
                    <th className="px-3 py-2 text-center">Payment</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isMovementsLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        <div className="inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      </td>
                    </tr>
                  ) : movements.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        No purchase movements logged for this vendor.
                      </td>
                    </tr>
                  ) : (
                    movements.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-center">
                          {!m.isSettled && (
                            <input
                              type="checkbox"
                              checked={selectedMovements.includes(m.id)}
                              onChange={() =>
                                setSelectedMovements((prev) =>
                                  prev.includes(m.id)
                                    ? prev.filter((id) => id !== m.id)
                                    : [...prev, m.id]
                                )
                              }
                              className="rounded border-slate-300 text-blue-600"
                            />
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">
                          {new Date(m.movedAt).toLocaleDateString('en-LK')}
                        </td>
                        <td className="px-3 py-2 font-mono font-bold text-slate-900">{m.itemId}</td>
                        <td className="px-3 py-2 text-center font-bold">{m.quantity}</td>
                        <td className="px-3 py-2 text-right font-mono">
                          {m.buyingPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                          {m.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2 text-center">{m.paymentMethod}</td>
                        <td className="px-3 py-2 text-center">
                          <Badge variant={m.isSettled ? 'success' : 'warning'}>
                            {m.isSettled ? 'Settled' : 'Unsettled'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

