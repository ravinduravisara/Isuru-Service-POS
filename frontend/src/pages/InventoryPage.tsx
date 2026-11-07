import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import {
  Boxes,
  Search,
  Plus,
  Upload,
  AlertTriangle,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Coins,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';

export const InventoryPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalSellingValue: 0,
    totalCostValue: 0,
    lowStockCount: 0,
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formItemId, setFormItemId] = useState('');
  const [formItemName, setFormItemName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formQuantity, setFormQuantity] = useState<number | string>(0);
  const [formUnitPrice, setFormUnitPrice] = useState<number | string>(0);
  const [formBuyingPrice, setFormBuyingPrice] = useState<number | string>(0);
  const [formSupplierCode, setFormSupplierCode] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState<'Cash' | 'Credit' | 'Cheque'>('Cash');

  // CSV Import Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvCategory, setCsvCategory] = useState('');
  const [csvBrand, setCsvBrand] = useState('');
  const [csvContent, setCsvContent] = useState('');

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, [search, selectedCategory]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const res = await api.get(`/inventory?${params.toString()}`);
      setProducts(res.data.items || []);
      if (res.data.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/inventory/categories');
      setCategories(res.data.categories || []);
    } catch {
      // Ignore
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormItemId('');
    setFormItemName(selectedCategory !== 'All' ? selectedCategory : '');
    setFormBrand('');
    setFormQuantity(0);
    setFormUnitPrice(0);
    setFormBuyingPrice(0);
    setFormSupplierCode('');
    setFormPaymentMethod('Cash');
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormItemId(p.itemId);
    setFormItemName(p.itemName);
    setFormBrand(p.brand || '');
    setFormQuantity(p.quantity);
    setFormUnitPrice(p.unitPrice);
    setFormBuyingPrice(p.buyingPrice);
    setFormSupplierCode(p.supplierCode || '');
    setFormPaymentMethod(p.paymentMethod || 'Cash');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItemName.trim()) {
      setStatusMessage({ type: 'error', text: 'Category / Item name is required.' });
      return;
    }

    try {
      const payload = {
        itemId: formItemId.trim().toUpperCase() || undefined,
        itemName: formItemName.trim(),
        brand: formBrand.trim(),
        quantity: Math.max(0, Number(formQuantity) || 0),
        unitPrice: Math.max(0, Number(formUnitPrice) || 0),
        buyingPrice: Math.max(0, Number(formBuyingPrice) || 0),
        supplierCode: formSupplierCode.trim(),
        paymentMethod: formPaymentMethod,
      };

      if (editingProduct) {
        await api.put(`/inventory/${editingProduct.id}`, payload);
        setStatusMessage({ type: 'success', text: 'Product updated successfully.' });
      } else {
        await api.post('/inventory', payload);
        setStatusMessage({ type: 'success', text: 'Product added to inventory.' });
      }

      setIsProductModalOpen(false);
      fetchInventory();
      fetchCategories();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to save product.',
      });
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      await api.delete(`/inventory/${id}`);
      setStatusMessage({ type: 'success', text: `Product "${name}" deleted.` });
      fetchInventory();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete product.',
      });
    }
  };

  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvCategory.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a target category name for the CSV.' });
      return;
    }
    if (!csvContent.trim()) {
      setStatusMessage({ type: 'error', text: 'CSV content cannot be empty.' });
      return;
    }

    try {
      const res = await api.post('/inventory/import-csv', {
        category: csvCategory.trim(),
        brand: csvBrand.trim(),
        csvContent: csvContent.trim(),
      });
      setStatusMessage({
        type: 'success',
        text: res.data.message || 'CSV imported successfully.',
      });
      setIsCsvModalOpen(false);
      setCsvContent('');
      fetchInventory();
      fetchCategories();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to import CSV.',
      });
    }
  };

  const filteredProducts = lowStockOnly
    ? products.filter((p) => p.quantity <= 5)
    : products;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory &amp; Parts Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track stock balances, unit selling rates, buying cost basis, and automated stock deductions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
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
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Catalog Items</span>
          <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">{summary.totalItems}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Retail Valuation</span>
          <p className="text-base sm:text-xl font-black text-emerald-600 mt-1 truncate">
            LKR {summary.totalSellingValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Cost Valuation</span>
          <p className="text-base sm:text-xl font-black text-blue-600 mt-1 truncate">
            LKR {summary.totalCostValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Low Stock Alerts</span>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg sm:text-xl font-black text-amber-600">{summary.lowStockCount}</p>
            <button
              onClick={() => setLowStockOnly(!lowStockOnly)}
              className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                lowStockOnly
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {lowStockOnly ? 'Filtered' : 'Filter ≤5'}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Item ID, Product Name, Brand, Supplier..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium text-right sm:text-left">
          Showing {filteredProducts.length} items
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-32">Item Code</th>
                <th className="px-5 py-3">Category / Name</th>
                <th className="px-5 py-3">Brand</th>
                <th className="px-5 py-3 text-center w-24">In Stock</th>
                <th className="px-5 py-3 text-right w-28">Selling (LKR)</th>
                <th className="px-5 py-3 text-right w-28">Buying (LKR)</th>
                <th className="px-5 py-3 w-28">Supplier</th>
                <th className="px-5 py-3 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{p.itemId}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{p.itemName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.brand || '—'}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          p.quantity <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : p.quantity <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-slate-900 font-mono">
                      {p.unitPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-500 font-mono">
                      {p.buyingPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                      {p.supplierCode || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Product"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin() && (
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.itemName)}
                            title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Edit Inventory Product' : 'Add New Inventory Product'}
        subtitle="Manage product codes, stock balance, and pricing basis"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item Code (Optional auto-generate)
              </label>
              <input
                type="text"
                value={formItemId}
                onChange={(e) => setFormItemId(e.target.value.toUpperCase())}
                placeholder="e.g. OIL-0001 or leave blank"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={formPaymentMethod}
                onChange={(e) => setFormPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category / Product Name *
              </label>
              <input
                type="text"
                required
                value={formItemName}
                onChange={(e) => setFormItemName(e.target.value)}
                placeholder="e.g. Engine Oil"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand / Spec
              </label>
              <input
                type="text"
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                placeholder="e.g. Mobil Super 2000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity in Stock
              </label>
              <input
                type="number"
                min="0"
                value={formQuantity}
                onChange={(e) => setFormQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-center font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formUnitPrice}
                onChange={(e) => setFormUnitPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-right font-bold text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Buying Cost (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formBuyingPrice}
                onChange={(e) => setFormBuyingPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-right text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier Code (Optional)
            </label>
            <input
              type="text"
              value={formSupplierCode}
              onChange={(e) => setFormSupplierCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUP-0001"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              {editingProduct ? 'Save Changes' : 'Add to Stock'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <Modal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        title="Batch Import Parts via CSV"
        subtitle="Paste or upload CSV text with format: ItemCode, SellingPrice"
      >
        <form onSubmit={handleImportCsv} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Category Name *
              </label>
              <input
                type="text"
                required
                value={csvCategory}
                onChange={(e) => setCsvCategory(e.target.value)}
                placeholder="e.g. Oil Filter"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Brand (Optional)
              </label>
              <input
                type="text"
                value={csvBrand}
                onChange={(e) => setCsvBrand(e.target.value)}
                placeholder="e.g. Bosch"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                CSV Data (ItemCode, Price) *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Example: OF-1001, 1250.00</span>
            </div>
            <textarea
              rows={6}
              required
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="OF-001, 850&#10;OF-002, 1200&#10;OF-003, 1450"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCsvModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              Start Batch Import
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

