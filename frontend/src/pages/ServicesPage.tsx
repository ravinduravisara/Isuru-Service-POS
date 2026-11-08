import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Service, VehicleType } from '../types';
import { offlineDb } from '../db/offlineDb';
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
  Tag,
  Bookmark,
  Download,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { downloadCsv } from '../utils/csvExport';

const DEFAULT_CATEGORIES: VehicleType[] = [
  'Car',
  'Three-Wheeler',
  'Van/Cab',
  '10 1/2 Lorry',
  '14 1/2 Lorry/ 10 1/2,16 1/2/Boom',
  'Ten-Wheel Lorry',
  'Tank Lorry / Cube 3,4 5Pc wheel/Tipper',
  'Cube Lorry / Small Tipper',
  'Batto Lorry',
  'Bus',
  'Bus (small)',
  'Bike',
  'Machine -30',
  'Custom',
  'Others',
];

const DEFAULT_PRESETS: string[] = [
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
  'Grease Full',
  'FullService',
  'Custom',
  'Diesel Filter',
  'Air filter',
  'Cabin Filter',
  'Engine Oil',
  'Gear Oil',
  'Differencel Oil',
  'Transfer Box Oil',
  'Break Oil',
  'Hydralauic Oil',
  'Power Sterling Oil',
  'Battery Water',
  'Radiator Coolant',
  'Radiator Plask',
  'Wash',
  'Car Wash',
  'Wapper Blade',
];

export const ServicesPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [categories, setCategories] = useState<VehicleType[]>(DEFAULT_CATEGORIES);
  const [presets, setPresets] = useState<string[]>(DEFAULT_PRESETS);
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

  // Preset Management Modal state
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [newPresetInput, setNewPresetInput] = useState('');
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [renamePresetInput, setRenamePresetInput] = useState('');
  const [presetError, setPresetError] = useState<string | null>(null);

  // Service Tag Management Modal state
  const [tags, setTags] = useState<string[]>(['Full Service', 'Body Wash', 'Custom Part']);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [renameTagInput, setRenameTagInput] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);

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
    fetchPresets();
    fetchTags();
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

  const fetchPresets = async () => {
    try {
      const res = await api.get('/services/presets');
      if (res.data?.presets && Array.isArray(res.data.presets)) {
        setPresets(res.data.presets);
      }
    } catch (err) {
      console.error('Failed to load service presets', err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await api.get('/services/tags');
      if (res.data?.tags && Array.isArray(res.data.tags)) {
        setTags(res.data.tags);
      }
    } catch (err) {
      console.error('Failed to load service tags', err);
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
      console.warn('Network services fetch failed. Falling back to offline cache:', err);
      try {
        const cached = await offlineDb.cachedServices.toArray();
        let filtered = cached;
        if (selectedCategory !== 'All') {
          filtered = filtered.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (search.trim()) {
          const s = search.trim().toLowerCase();
          filtered = filtered.filter(
            (sv) => sv.name.toLowerCase().includes(s) || (sv.description && sv.description.toLowerCase().includes(s))
          );
        }
        setServices(
          filtered.map((s) => ({
            id: s.id,
            category: s.category as VehicleType,
            name: s.name,
            price: s.price,
            description: s.description || '',
          }))
        );
      } catch (dbErr) {
        console.error('Failed to load cached services:', dbErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormCategory(selectedCategory === 'All' ? (categories[0] || 'Car') : selectedCategory);
    setFormName('');
    setFormPrice('');
    setFormDescription(
      selectedCategory === 'Custom' ? 'Custom Service / Consumable' : 'Full Service'
    );
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

  // Preset Management Handlers
  const handleAddPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPresetInput.trim();
    if (!clean) return;
    setPresetError(null);

    try {
      const res = await api.post('/services/presets', { name: clean });
      if (res.data?.presets) {
        setPresets(res.data.presets);
      } else {
        await fetchPresets();
      }
      setNewPresetInput('');
      setStatusMessage({ type: 'success', text: `Preset "${clean}" added successfully.` });
    } catch (err: any) {
      setPresetError(err.response?.data?.error || 'Failed to add preset.');
    }
  };

  const handleStartRenamePreset = (name: string) => {
    setEditingPreset(name);
    setRenamePresetInput(name);
    setPresetError(null);
  };

  const handleSaveRenamePreset = async (oldName: string) => {
    const clean = renamePresetInput.trim();
    if (!clean || clean.toLowerCase() === oldName.toLowerCase()) {
      setEditingPreset(null);
      return;
    }
    setPresetError(null);

    try {
      const res = await api.put(`/services/presets/${encodeURIComponent(oldName)}`, { newName: clean });
      if (res.data?.presets) {
        setPresets(res.data.presets);
      } else {
        await fetchPresets();
      }
      if (formName === oldName) {
        setFormName(clean);
      }
      setEditingPreset(null);
      setStatusMessage({ type: 'success', text: `Preset renamed to "${clean}".` });
    } catch (err: any) {
      setPresetError(err.response?.data?.error || 'Failed to rename preset.');
    }
  };

  const handleDeletePreset = async (name: string) => {
    if (!window.confirm(`Are you sure you want to remove preset "${name}"?`)) return;
    setPresetError(null);

    try {
      const res = await api.delete(`/services/presets/${encodeURIComponent(name)}`);
      if (res.data?.presets) {
        setPresets(res.data.presets);
      } else {
        await fetchPresets();
      }
      setStatusMessage({ type: 'success', text: `Preset "${name}" removed.` });
    } catch (err: any) {
      setPresetError(err.response?.data?.error || 'Failed to delete preset.');
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim();
    if (!clean) return;
    setTagError(null);

    try {
      const res = await api.post('/services/tags', { name: clean });
      if (res.data?.tags) {
        setTags(res.data.tags);
      } else {
        await fetchTags();
      }
      setNewTagInput('');
      setStatusMessage({ type: 'success', text: `Tag "${clean}" added successfully.` });
    } catch (err: any) {
      setTagError(err.response?.data?.error || 'Failed to add tag.');
    }
  };

  const handleStartRenameTag = (name: string) => {
    setEditingTag(name);
    setRenameTagInput(name);
    setTagError(null);
  };

  const handleSaveRenameTag = async (oldName: string) => {
    const clean = renameTagInput.trim();
    if (!clean || clean.toLowerCase() === oldName.toLowerCase()) {
      setEditingTag(null);
      return;
    }
    setTagError(null);

    try {
      const res = await api.put(`/services/tags/${encodeURIComponent(oldName)}`, { newName: clean });
      if (res.data?.tags) {
        setTags(res.data.tags);
      } else {
        await fetchTags();
      }
      if (formDescription === oldName) {
        setFormDescription(clean);
      }
      await fetchServices();
      setEditingTag(null);
      setStatusMessage({ type: 'success', text: `Tag renamed to "${clean}".` });
    } catch (err: any) {
      setTagError(err.response?.data?.error || 'Failed to rename tag.');
    }
  };

  const handleDeleteTag = async (name: string) => {
    if (!window.confirm(`Are you sure you want to remove tag "${name}"?`)) return;
    setTagError(null);

    try {
      const res = await api.delete(`/services/tags/${encodeURIComponent(name)}`);
      if (res.data?.tags) {
        setTags(res.data.tags);
      } else {
        await fetchTags();
      }
      setStatusMessage({ type: 'success', text: `Tag "${name}" removed.` });
    } catch (err: any) {
      setTagError(err.response?.data?.error || 'Failed to delete tag.');
    }
  };

  const handleExportServicesCsv = () => {
    const headers = ['Vehicle Category', 'Service Name', 'Rate / Price (LKR)', 'Description'];
    const rows = services.map((s) => [
      s.category,
      s.name,
      s.price,
      s.description || '',
    ]);

    downloadCsv(`isuru_service_rates_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service &amp; Labour Rate Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure vehicle category-specific service labor rates (Full Service, Body Wash, Custom), pricing, and descriptions.
          </p>
        </div>

        {isAdmin() && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportServicesCsv}
              disabled={services.length === 0}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Export all service rates to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setPresetError(null);
                setEditingPreset(null);
                setIsPresetModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              title="Add, edit or delete service presets"
            >
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>Manage Presets</span>
            </button>

            <button
              onClick={() => {
                setTagError(null);
                setEditingTag(null);
                setIsTagModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              title="Add, edit or delete package & service tags"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>Manage Tags</span>
            </button>

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
                <th className="px-5 py-3">Tag / Notes</th>
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
                            : svc.category.includes('Van')
                            ? 'purple'
                            : svc.category.includes('Bus')
                            ? 'warning'
                            : svc.category.includes('Lorry')
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
                    <td className="px-5 py-3.5 text-slate-500">
                      {svc.description ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {svc.description}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Service / Labour Name *
              </label>
              {isAdmin() && (
                <button
                  type="button"
                  onClick={() => {
                    setPresetError(null);
                    setEditingPreset(null);
                    setIsPresetModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>+ Manage Presets</span>
                </button>
              )}
            </div>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Service Charge, Engine Wash, Body Wash..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />

            {/* Dynamic Preset Chips */}
            <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Quick Presets ({presets.length})
                </span>
                {isAdmin() && (
                  <button
                    type="button"
                    onClick={() => {
                      setPresetError(null);
                      setEditingPreset(null);
                      setIsPresetModalOpen(true);
                    }}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Edit / Delete Presets
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 max-h-28 overflow-y-auto pr-1">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormName(preset)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      formName === preset
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Package / Tag / Notes
              </label>
              {isAdmin() && (
                <button
                  type="button"
                  onClick={() => {
                    setTagError(null);
                    setEditingTag(null);
                    setIsTagModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>+ Manage Tags</span>
                </button>
              )}
            </div>

            {/* Dynamic Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFormDescription(tag)}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors cursor-pointer ${
                    formDescription === tag
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="e.g. Full Service, Body Wash, or consumable details..."
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

      {/* Manage Service Presets Modal */}
      <Modal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        title="Manage Service Name Presets"
        subtitle="Add, edit/rename, or remove service name presets used for quick rate configuration"
      >
        <div className="space-y-4">
          {presetError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center justify-between">
              <span>{presetError}</span>
              <button
                type="button"
                onClick={() => setPresetError(null)}
                className="font-bold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Add Preset Form */}
          <form onSubmit={handleAddPreset} className="flex gap-2">
            <input
              type="text"
              value={newPresetInput}
              onChange={(e) => setNewPresetInput(e.target.value)}
              placeholder="Add new preset (e.g. Radiator Flush, Polish, Tire Shine)..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newPresetInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Preset</span>
            </button>
          </form>

          {/* Existing Presets List */}
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {presets.map((preset) => {
              const isRenaming = editingPreset === preset;

              return (
                <div
                  key={preset}
                  className="p-2.5 px-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-xs"
                >
                  {isRenaming ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={renamePresetInput}
                        onChange={(e) => setRenamePresetInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRenamePreset(preset);
                          if (e.key === 'Escape') setEditingPreset(null);
                        }}
                        className="flex-1 px-2.5 py-1.5 border border-blue-500 rounded text-xs text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRenamePreset(preset)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                        title="Save rename"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPreset(null)}
                        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-900">{preset}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartRenamePreset(preset)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Rename Preset"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Preset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Presets allow one-click entry when adding and pricing vehicle services.</span>
            <button
              type="button"
              onClick={() => setIsPresetModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Manage Package & Service Tags Modal */}
      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title="Manage Package & Service Tags"
        subtitle="Add, rename, or delete category tags (Full Service, Body Wash, Custom, etc.)"
      >
        <div className="space-y-5">
          {tagError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center justify-between">
              <span>{tagError}</span>
              <button
                type="button"
                onClick={() => setTagError(null)}
                className="font-bold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Add Tag Form */}
          <form onSubmit={handleAddTag} className="flex gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Add new tag (e.g. Full Service, Body Wash, Engine Wash, Custom)..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newTagInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tag</span>
            </button>
          </form>

          {/* Existing Tags List */}
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {tags.map((tag) => {
              const isRenaming = editingTag === tag;

              return (
                <div
                  key={tag}
                  className="p-2.5 px-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-xs"
                >
                  {isRenaming ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={renameTagInput}
                        onChange={(e) => setRenameTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRenameTag(tag);
                          if (e.key === 'Escape') setEditingTag(null);
                        }}
                        className="flex-1 px-2.5 py-1.5 border border-blue-500 rounded text-xs text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRenameTag(tag)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                        title="Save rename"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTag(null)}
                        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-900">{tag}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartRenameTag(tag)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Rename Tag"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Tag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Tags categorize services and can be attached to any service record.</span>
            <button
              type="button"
              onClick={() => setIsTagModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
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
              placeholder="Add new vehicle type (e.g. Three-Wheeler, Tractor, SUV)..."
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
