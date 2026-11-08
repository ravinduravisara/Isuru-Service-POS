import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Customer, Vehicle, Invoice, VehicleType } from '../types';
import { offlineDb } from '../db/offlineDb';
import {
  Users,
  Search,
  Plus,
  Car,
  FileText,
  Phone,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';

const DEFAULT_VEHICLE_TYPES: VehicleType[] = ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'];

export const CustomersPage: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(DEFAULT_VEHICLE_TYPES);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewCustomerData, setViewCustomerData] = useState<{
    customer: Customer;
    vehicles: Vehicle[];
    invoices: Invoice[];
  } | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNic, setFormNic] = useState('');
  const [formBankDetails, setFormBankDetails] = useState('');

  // Add vehicle form fields (inside drilldown modal)
  const [newVehicleNo, setNewVehicleNo] = useState('');
  const [newVehicleType, setNewVehicleType] = useState<VehicleType>('Car');

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchVehicleTypes = async () => {
    try {
      const res = await api.get('/vehicles/types');
      if (res.data?.vehicleTypes && Array.isArray(res.data.vehicleTypes)) {
        setVehicleTypes(res.data.vehicleTypes);
      }
    } catch {
      // Keep defaults
    }
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/customers?search=${encodeURIComponent(search.trim())}`);
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.warn('Network customer fetch failed. Falling back to offline cache:', err);
      try {
        const cached = await offlineDb.cachedCustomers.toArray();
        let filtered = cached;
        if (search.trim()) {
          const s = search.trim().toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(s) ||
              c.phone.toLowerCase().includes(s) ||
              (c.nic && c.nic.toLowerCase().includes(s))
          );
        }
        setCustomers(
          filtered.map((c) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            idNo: c.nic,
            bankDetails: c.bankDetails,
            createdAt: c.updatedAt || '',
            vehicles: [],
          }))
        );
      } catch (dbErr) {
        console.error('Failed to load cached customers:', dbErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormPhone('');
    setFormNic('');
    setFormBankDetails('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormName(customer.name);
    setFormPhone(customer.phone || '');
    setFormNic(customer.nic || '');
    setFormBankDetails(customer.bankDetails || '');
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setStatusMessage({ type: 'error', text: 'Customer name is required.' });
      return;
    }

    const cleanPhone = formPhone.trim();
    if (cleanPhone && !/^\d{10}$/.test(cleanPhone)) {
      setStatusMessage({
        type: 'error',
        text: 'Phone number must be exactly 10 digits (numbers only, e.g. 0771234567).',
      });
      return;
    }

    const cleanNic = formNic.trim().toUpperCase();
    if (cleanNic) {
      const isOldNic = /^[0-9]{9}[VX]$/.test(cleanNic);
      const isNewNic = /^[0-9]{12}$/.test(cleanNic);
      if (!isOldNic && !isNewNic) {
        setStatusMessage({
          type: 'error',
          text: 'Customer ID No must be a valid Old ID (9 digits + V/X, e.g. 851234567V) or New ID (12 digits, e.g. 199812345678).',
        });
        return;
      }
    }

    const cleanBankDetails = formBankDetails.trim();

    try {
      const payload = {
        name: formName.trim(),
        phone: cleanPhone,
        nic: cleanNic,
        bankDetails: cleanBankDetails,
      };

      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, payload);
        setStatusMessage({ type: 'success', text: 'Customer updated successfully.' });
        setEditingCustomer(null);
      } else {
        await api.post('/customers', payload);
        setStatusMessage({ type: 'success', text: 'Customer registered successfully.' });
        setIsCreateModalOpen(false);
      }
      fetchCustomers();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to save customer.',
      });
    }
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) return;
    try {
      await api.delete(`/customers/${id}`);
      setStatusMessage({ type: 'success', text: `Customer "${name}" deleted.` });
      fetchCustomers();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete customer.',
      });
    }
  };

  const handleViewCustomer = async (id: string) => {
    try {
      const res = await api.get(`/customers/${id}`);
      setViewCustomerData(res.data);
      setNewVehicleNo('');
      setNewVehicleType('Car');
    } catch (err) {
      console.error('Failed to load customer details', err);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewCustomerData || !newVehicleNo.trim()) return;

    try {
      await api.post('/vehicles', {
        customerId: viewCustomerData.customer.id,
        vehicleNo: newVehicleNo.trim().toUpperCase(),
        vehicleType: newVehicleType,
      });
      setStatusMessage({ type: 'success', text: 'Vehicle registered to customer!' });
      setNewVehicleNo('');
      // Refresh customer view data
      handleViewCustomer(viewCustomerData.customer.id);
      fetchCustomers();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to register vehicle.',
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer &amp; Vehicle Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain customer records, contact profiles, and associated service vehicles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
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

      {/* Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, ID number, telephone, or bank details..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-slate-500 font-medium text-right sm:text-left">
          Total: {customers.length} {customers.length === 1 ? 'Customer' : 'Customers'}
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-4 py-3">Customer ID No</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Bank Details</th>
                <th className="px-4 py-3 text-center">Registered Vehicles</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700">
                      {c.nic ? (
                        <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                          <CreditCard className="w-3 h-3 text-slate-500" />
                          {c.nic}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not recorded</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700 font-medium">
                      {c.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {c.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not recorded</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-[200px]" title={c.bankDetails || ''}>
                      {c.bankDetails ? (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700 truncate max-w-full">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{c.bankDetails}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                        <Car className="w-3 h-3 text-slate-500" />
                        <span>{c.vehiclesCount || 0}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString('en-LK', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewCustomer(c.id)}
                          title="View Details & History"
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Vehicles &amp; History</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          title="Edit Customer"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin() && (
                          <button
                            onClick={() => handleDeleteCustomer(c.id, c.name)}
                            title="Delete Customer"
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

      {/* Create / Edit Customer Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!editingCustomer}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCustomer(null);
        }}
        title={editingCustomer ? 'Edit Customer' : 'Register New Customer'}
        subtitle="Manage customer contact, ID card, and banking information"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. John Perera"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Customer ID No :
                </label>
                <span className="text-[10px] text-slate-400">Old or New ID</span>
              </div>
              <input
                type="text"
                value={formNic}
                onChange={(e) => {
                  const upper = e.target.value.toUpperCase().replace(/[^0-9VX]/g, '').slice(0, 12);
                  setFormNic(upper);
                }}
                placeholder="e.g. 851234567V or 199812345678"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Old ID: 9 digits + V/X • New ID: 12 digits
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Phone Number
                </label>
                <span className="text-[10px] text-slate-400">10 digits only</span>
              </div>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormPhone(digits);
                }}
                placeholder="e.g. 0771234567"
                maxLength={10}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                {formPhone.length > 0 ? `${formPhone.length}/10 digits entered` : 'Numbers only (exact 10 digits)'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bank Details
            </label>
            <input
              type="text"
              value={formBankDetails}
              onChange={(e) => setFormBankDetails(e.target.value)}
              placeholder="e.g. BOC - 7010234567 (Colombo Branch) or Commercial Bank"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Bank name, account number, branch details
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingCustomer(null);
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              {editingCustomer ? 'Save Changes' : 'Register Customer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Customer Drilldown Modal: Vehicles & Billing History */}
      {viewCustomerData && (
        <Modal
          isOpen={!!viewCustomerData}
          onClose={() => setViewCustomerData(null)}
          title={viewCustomerData.customer.name}
          subtitle={`Customer Record • Phone: ${viewCustomerData.customer.phone || 'None'}${
            viewCustomerData.customer.nic ? ` • ID: ${viewCustomerData.customer.nic}` : ''
          }${viewCustomerData.customer.bankDetails ? ` • Bank: ${viewCustomerData.customer.bankDetails}` : ''}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Section 1: Linked Vehicles */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Linked Vehicles ({viewCustomerData.vehicles.length})</span>
                </h4>
              </div>

              {viewCustomerData.vehicles.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  No vehicles registered for this client yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {viewCustomerData.vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-mono font-bold text-slate-900 text-xs">{v.vehicleNo}</p>
                        <p className="text-[11px] text-slate-500">{v.vehicleType}</p>
                      </div>
                      <Badge variant="neutral">{v.vehicleType}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Vehicle Form */}
              <form
                onSubmit={handleAddVehicle}
                className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200/60 flex flex-wrap items-center gap-2"
              >
                <div className="flex-1 min-w-[140px]">
                  <input
                    type="text"
                    required
                    value={newVehicleNo}
                    onChange={(e) => setNewVehicleNo(e.target.value.toUpperCase())}
                    placeholder="New Vehicle No (WP CAA-1234)"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono uppercase bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-28">
                  <select
                    value={newVehicleType}
                    onChange={(e) => setNewVehicleType(e.target.value as VehicleType)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-blue-500"
                  >
                    {vehicleTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                >
                  + Add Vehicle
                </button>
              </form>
            </div>

            {/* Section 2: Invoice History */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Service Invoices History ({viewCustomerData.invoices.length})</span>
              </h4>

              {viewCustomerData.invoices.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  No billing history recorded for this customer yet.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[480px]">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Bill No</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Vehicle</th>
                        <th className="px-3 py-2">Payment</th>
                        <th className="px-3 py-2 text-right">Amount (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewCustomerData.invoices.map((inv) => (
                        <tr key={inv.id || (inv as any)._id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-bold text-blue-600">{inv.billNo}</td>
                          <td className="px-3 py-2 text-slate-500">
                            {new Date(inv.dateTime).toLocaleDateString('en-LK')}
                          </td>
                          <td className="px-3 py-2 font-mono font-medium">{inv.vehicleNo}</td>
                          <td className="px-3 py-2">{inv.paymentMethod}</td>
                          <td className="px-3 py-2 text-right font-black text-slate-900">
                            {inv.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

