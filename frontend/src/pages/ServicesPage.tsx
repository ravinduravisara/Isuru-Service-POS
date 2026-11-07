import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Service, VehicleType } from '../types';
import { Wrench, Search, Plus, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';

const CATEGORIES: (VehicleType | 'All')[] = [
  'All',
  'Car',
  'Bike',
  'Van',
  'Bus',
  'Lorry',
  'Others',
];

export const ServicesPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VehicleType | 'All'>('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [formCategory, setFormCategory] = useState<VehicleType>('Car');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number | string>('');
  const [formDescription, setFormDescription] = useState('');

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, search]);

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
    setFormCategory(selectedCategory === 'All' ? 'Car' : selectedCategory);
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service &amp; Labour Rate Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure vehicle category-specific service labor rates, pricing, and descriptions.
          </p>
        </div>

        {isAdmin() && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service Rate</span>
          </button>
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehicle Category *
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as VehicleType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
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
              placeholder="e.g. Engine Oil Change"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
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
    </div>
  );
};

