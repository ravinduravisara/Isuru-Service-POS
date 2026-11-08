import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Supplier } from '../types';
import { offlineDb } from '../db/offlineDb';
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
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
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

  const previewItems = React.useMemo(() => {
    if (!csvContent.trim()) return [];
    const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed: { item: string; price: number }[] = [];
    for (const line of lines) {
      if (line.includes(',')) {
        const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        if (parts.length >= 2) {
          const price = parseFloat(parts[parts.length - 1].replace(/[^0-9.]/g, ''));
          const item = parts[0].trim().toUpperCase();
          if (item && !isNaN(price)) {
            parsed.push({ item, price });
            continue;
          }
        }
      }
      if (line.includes('\t')) {
        const parts = line.split('\t').map((p) => p.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        if (parts.length >= 2) {
          const price = parseFloat(parts[parts.length - 1].replace(/[^0-9.]/g, ''));
          const item = parts[0].trim().toUpperCase();
          if (item && !isNaN(price)) {
            parsed.push({ item, price });
            continue;
          }
        }
      }
      const spaceMatch = line.match(/^(.*?)\s+([LKR|Rs\.]*\s*[0-9,]+(?:\.[0-9]+)?)\s*$/i);
      if (spaceMatch) {
        const item = spaceMatch[1].trim().replace(/^["']|["']$/g, '').toUpperCase();
        const price = parseFloat(spaceMatch[2].replace(/[^0-9.]/g, ''));
        if (item && !isNaN(price)) {
          parsed.push({ item, price });
          continue;
        }
      }
    }
    return parsed;
  }, [csvContent]);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchInventory();
    fetchCategories();
    fetchSuppliers();
  }, [search, selectedCategory]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliersList(res.data.suppliers || []);
    } catch {
      // Ignore
    }
  };

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
      console.warn('Network inventory fetch failed. Falling back to offline cache:', err);
      try {
        const cached = await offlineDb.cachedProducts.toArray();
        let filtered = cached;
        if (search.trim()) {
          const s = search.trim().toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.itemId.toLowerCase().includes(s) ||
              p.itemName.toLowerCase().includes(s) ||
              p.brand.toLowerCase().includes(s)
          );
        }
        if (selectedCategory !== 'All') {
          filtered = filtered.filter((p) => p.itemName.toLowerCase() === selectedCategory.toLowerCase());
        }
        setProducts(
          filtered.map((p) => ({
            id: p.id,
            itemId: p.itemId,
            itemName: p.itemName,
            brand: p.brand,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            buyingPrice: p.buyingPrice,
            supplierCode: p.supplierCode,
            paymentMethod: 'Cash',
            updatedAt: p.updatedAt || '',
            sellingValue: p.quantity * p.unitPrice,
            costValue: p.quantity * p.buyingPrice,
          }))
        );
        const totalItems = filtered.reduce((sum, p) => sum + p.quantity, 0);
        const totalSellingValue = filtered.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
        const totalCostValue = filtered.reduce((sum, p) => sum + p.quantity * p.buyingPrice, 0);
        const lowStockCount = filtered.filter((p) => p.quantity <= 5).length;
        setSummary({ totalItems, totalSellingValue, totalCostValue, lowStockCount });
      } catch (dbErr) {
        console.error('Failed to load cached inventory:', dbErr);
      }
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

  const handleOpenCsv = () => {
    setCsvCategory(selectedCategory !== 'All' ? selectedCategory : '');
    setCsvBrand('');
    setCsvContent('');
    setIsCsvModalOpen(true);
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
      setSelectedCategory('All');
      setSearch('');
      setLowStockOnly(false);
      await fetchInventory();
      await fetchCategories();
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
            onClick={handleOpenCsv}
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
          <span className="text-[10px] text-slate-400">Total store products</span>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Retail Valuation</span>
          <p className="text-base sm:text-xl font-black text-emerald-600 mt-1 truncate">
            LKR {summary.totalSellingValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-400">Inventory selling value</span>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Cost Valuation</span>
          <p className="text-base sm:text-xl font-black text-blue-600 mt-1 truncate">
            LKR {summary.totalCostValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-400">Inventory cost basis</span>
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
          <span className="text-[10px] text-slate-400">Items with &le; 5 units</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
              <option value="All">All Categories ({summary.totalItems} items)</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium text-right sm:text-left">
            Showing {filteredProducts.length} of {summary.totalItems} items
          </span>
        </div>

        {/* Filter Notice Banner if category is filtered */}
        {selectedCategory !== 'All' && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            <span>
              Showing only category: <strong>{selectedCategory}</strong> ({filteredProducts.length} items)
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
            >
              Clear Filter (Show All Items)
            </button>
          </div>
        )}
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Supplier Code (Optional)
              </label>
              {suppliersList.length > 0 && (
                <span className="text-[11px] text-slate-400">
                  {suppliersList.length} registered
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                list="inventory-suppliers-list"
                value={formSupplierCode}
                onChange={(e) => setFormSupplierCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUP-0001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500"
              />
              {suppliersList.length > 0 && (
                <select
                  value={
                    suppliersList.some(
                      (s) => s.supplierCode.toUpperCase() === formSupplierCode.trim().toUpperCase()
                    )
                      ? formSupplierCode.trim().toUpperCase()
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) setFormSupplierCode(e.target.value);
                  }}
                  className="px-2 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-blue-500 min-w-[160px] cursor-pointer"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliersList.map((s) => (
                    <option key={s.id} value={s.supplierCode}>
                      {s.supplierCode} ({s.name})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <datalist id="inventory-suppliers-list">
              {suppliersList.map((s) => (
                <option key={s.id} value={s.supplierCode} label={s.name} />
              ))}
            </datalist>
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
        subtitle="Paste CSV, Excel table, or space/tab-separated data (e.g. ItemCode Price or ItemCode, Price)"
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
              {categories.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] text-slate-400">Existing:</span>
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCsvCategory(c)}
                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                        csvCategory === c
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Brand (Optional)
              </label>
              <input
                type="text"
                value={csvBrand}
                onChange={(e) => setCsvBrand(e.target.value)}
                placeholder="e.g. SAKURA"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Data (ItemCode, Price or ItemCode Price) *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Accepts space, comma, or tab separated</span>
            </div>
            <textarea
              rows={6}
              required
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="EO-24070 / LR004459 2380.00&#10;C-38010 / JX0810D2  2970.00&#10;C-7971  2100.00&#10;OF-001, 1250.00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
            />

            {previewItems.length > 0 && (
              <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <span className="font-bold text-emerald-800">
                  ✓ {previewItems.length} item{previewItems.length > 1 ? 's' : ''} detected ready to import:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {previewItems.slice(0, 10).map((it, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-emerald-200 rounded text-[10px] text-slate-700 font-mono shadow-2xs"
                    >
                      <span className="font-semibold text-slate-900">{it.item}</span>
                      <span className="text-emerald-700 font-bold">LKR {it.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </span>
                  ))}
                  {previewItems.length > 10 && (
                    <span className="text-[10px] text-slate-500 self-center font-medium pl-1">
                      +{previewItems.length - 10} more...
                    </span>
                  )}
                </div>
              </div>
            )}

            {csvContent.trim() && previewItems.length === 0 && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                ⚠️ No items with valid prices detected. Make sure each line ends with a numeric price (e.g. <code>OF-1001 1250.00</code> or <code>OF-1001, 1250.00</code>).
              </div>
            )}
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
              disabled={previewItems.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              {previewItems.length > 0
                ? `Start Batch Import (${previewItems.length} Items)`
                : 'Start Batch Import'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

