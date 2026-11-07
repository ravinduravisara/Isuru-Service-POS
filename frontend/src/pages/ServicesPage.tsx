import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Service, VehicleType } from '../types';
import {
  Wrench,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings,
  Check,
  X,
  Car,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';

const DEFAULT_CATEGORIES: VehicleType[] = [
  'Car',
  'Bike',
  'Van',
  'Bus',
  'Lorry',
  'Others',
];

export const ServicesPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [categories, setCategories] = useState<VehicleType[]>(DEFAULT_CATEGORIES);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VehicleType | 'All'>('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Service Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Category Management Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Form fields
  const [formCategory, setFormCategory] = useState<VehicleType>('Car');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number | string>('');
  const [formDescription, setFormDescription] = useState('');

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, search]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/vehicles/types');
      if (res.data?.vehicleTypes && Array.isArray(res.data.vehicleTypes)) {
        setCategories(res.data.vehicleTypes);
      }
    } catch (err) {
      console.error('Failed to load vehicle categories', err);
    }
  };

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/services?${params.toString()}`);
      setServices(res.data.services || []);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormCategory(selectedCategory === 'All' ? (categories[0] || 'Car') : selectedCategory);
    setFormName('');
    setFormPrice('');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: Service) => {
    setEditingService(svc);
    setFormCategory(svc.category);
    setFormName(svc.name);
    setFormPrice(svc.price);
    setFormDescription(svc.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setStatusMessage({ type: 'error', text: 'Service name is required.' });
      return;
    }
    const priceNum = Number(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid price.' });
      return;
    }

    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, {
          category: formCategory,
          name: formName.trim(),
          price: priceNum,
          description: formDescription.trim(),
        });
        setStatusMessage({ type: 'success', text: 'Service rate updated successfully.' });
      } else {
        await api.post('/services', {
          category: formCategory,
          name: formName.trim(),
          price: priceNum,
          description: formDescription.trim(),
        });
        setStatusMessage({ type: 'success', text: 'Service created successfully.' });
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to save service rate.',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${name}"?`)) return;
    try {
      await api.delete(`/services/${id}`);
      setStatusMessage({ type: 'success', text: `Service "${name}" deleted.` });
      fetchServices();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete service.',
      });
    }
  };

  // Category Management Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategoryInput.trim();
    if (!clean) return;
    setCategoryError(null);

    try {
      const res = await api.post('/vehicles/types', { name: clean });
      if (res.data?.vehicleTypes) {
        setCategories(res.data.vehicleTypes);
      } else {
        await fetchCategories();
      }
      setNewCategoryInput('');
      setStatusMessage({ type: 'success', text: `Vehicle category "${clean}" created.` });
    } catch (err: any) {
      setCategoryError(err.response?.data?.error || 'Failed to create vehicle category.');
    }
  };

  const handleStartRename = (cat: string) => {
    setEditingCategory(cat);
    setRenameInput(cat);
    setCategoryError(null);
  };

  const handleSaveRename = async (oldName: string) => {
    const clean = renameInput.trim();
    if (!clean || clean.toLowerCase() === oldName.toLowerCase()) {
      setEditingCategory(null);
      return;
    }
    setCategoryError(null);

    try {
      const res = await api.put(`/vehicles/types/${encodeURIComponent(oldName)}`, { newName: clean });
      if (res.data?.vehicleTypes) {
        setCategories(res.data.vehicleTypes);
      } else {
        await fetchCategories();
      }
      if (selectedCategory === oldName) {
        setSelectedCategory(clean);
      }
      setEditingCategory(null);
      setStatusMessage({ type: 'success', text: `Category renamed to "${clean}".` });
      fetchServices();
    } catch (err: any) {
      setCategoryError(err.response?.data?.error || 'Failed to rename vehicle category.');
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (cat.toLowerCase() === 'others') {
      alert('The default "Others" vehicle category cannot be deleted.');
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete category "${cat}"?\n\nAny existing services, customer vehicles, or billing records associated with "${cat}" will automatically be moved to "Others".`
      )
    ) {
      return;
    }
    setCategoryError(null);

    try {
      const res = await api.delete(`/vehicles/types/${encodeURIComponent(cat)}`);
      if (res.data?.vehicleTypes) {
        setCategories(res.data.vehicleTypes);
      } else {
        await fetchCategories();
      }
      if (selectedCategory === cat) {
        setSelectedCategory('All');
      }
      setStatusMessage({
        type: 'success',
        text: `Category "${cat}" deleted. Associated records moved to "Others".`,
      });
      fetchServices();
    } catch (err: any) {
      setCategoryError(err.response?.data?.error || 'Failed to delete vehicle category.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service &amp; Labour Rate Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure vehicle category-specific service labor rates (FullService, Body Wash, Custom), pricing, and descriptions.
          </p>
        </div>

        {isAdmin() && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setCategoryError(null);
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              title="Add, rename or delete vehicle categories"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Manage Vehicle Types</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service Rate</span>
            </button>
          </div>
        )}
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

      {/* Category Tabs & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto flex-nowrap sm:flex-wrap">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          {isAdmin() && (
            <button
              onClick={() => {
                setCategoryError(null);
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-300 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Add, rename or delete vehicle categories"
            >
              <Plus className="w-3 h-3" />
              <span>Manage Types</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name or description..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[560px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-32">Category</th>
                <th className="px-5 py-3">Service Name</th>
                <th className="px-5 py-3 text-right w-36">Standard Rate (LKR)</th>
                <th className="px-5 py-3">Description</th>
                {isAdmin() && <th className="px-5 py-3 text-right w-24">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin() ? 5 : 4} className="px-5 py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? 5 : 4} className="px-5 py-8 text-center text-slate-400">
                    No services found for this vehicle category.
                  </td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          svc.category === 'Car'
                            ? 'info'
                            : svc.category === 'Bike'
                            ? 'success'
                            : svc.category === 'Van'
                            ? 'purple'
                            : svc.category === 'Bus'
                            ? 'warning'
                            : svc.category === 'Lorry'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {svc.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{svc.name}</td>
                    <td className="px-5 py-3.5 text-right font-black text-slate-900 font-mono">
                      {svc.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{svc.description || '—'}</td>
                    {isAdmin() && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(svc)}
                            title="Edit Service"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(svc.id, svc.name)}
                            title="Delete Service"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service Rate' : 'Add New Service Rate'}
        subtitle="Set category, standard rate, and service notes"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Vehicle Category *
              </label>
              {isAdmin() && (
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsCategoryModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  + Manage Categories
                </button>
              )}
            </div>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as VehicleType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service / Labour Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. FullService, Body Wash, Custom"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Presets:</span>
              {[
                'Service Charge',
                'Engine Wash',
                'Engine Chemical',
                'Grease',
                'Penetrating Oil',
                'Diesel',
                'Kerosene',
                'High Pressure',
                'Chemical',
                'Body Wash',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormName(preset)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                    formName === preset
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Standard Rate (LKR) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Optional notes or instructions..."
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
              {editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Manage Vehicle Categories Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Manage Vehicle Categories"
        subtitle="Add, rename, or delete vehicle types across services, vehicles, and billing"
      >
        <div className="space-y-5">
          {categoryError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center justify-between">
              <span>{categoryError}</span>
              <button
                type="button"
                onClick={() => setCategoryError(null)}
                className="font-bold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="Add new vehicle type (e.g. Three-Wheeler, SUV, Tractor)..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newCategoryInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Type</span>
            </button>
          </form>

          {/* Existing Categories List */}
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {categories.map((cat) => {
              const isRenaming = editingCategory === cat;
              const isOthers = cat.toLowerCase() === 'others';

              return (
                <div
                  key={cat}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  {isRenaming ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={renameInput}
                        onChange={(e) => setRenameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(cat);
                          if (e.key === 'Escape') setEditingCategory(null);
                        }}
                        className="flex-1 px-2.5 py-1.5 border border-blue-500 rounded text-xs text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRename(cat)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                        title="Save rename"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs">{cat}</span>
                        {isOthers && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            (System Default)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartRename(cat)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Rename Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {!isOthers && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Renaming updates related services, vehicles &amp; invoices automatically.</span>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
