import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Settings,
  Building,
  Shield,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'purge'>('profile');

  // Business Profile Form
  const [businessName, setBusinessName] = useState('ISURU Service Center');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [logoPreview, setLogoPreview] = useState<string>('/images/logo.png');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Credentials Form
  const [adminUsername, setAdminUsername] = useState('Isuru@6800');
  const [adminPassword, setAdminPassword] = useState('');
  const [userUsername, setUserUsername] = useState('User@123');
  const [userPassword, setUserPassword] = useState('');

  // Purge Confirmation Modal
  const [purgeModalType, setPurgeModalType] = useState<'all' | 'suppliers' | null>(null);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data?.settings) {
        const s = res.data.settings;
        setBusinessName(s.businessName || '');
        setBusinessAddress(s.businessAddress || '');
        setBusinessPhone(s.businessPhone || '');
        setAdminUsername(s.adminUsername || '');
        setUserUsername(s.userUsername || '');
        if (s.logoUrl) setLogoPreview(s.logoUrl);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings/profile', {
        businessName,
        businessAddress,
        businessPhone,
      });
      setStatusMessage({ type: 'success', text: 'Business profile updated successfully.' });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update business profile.',
      });
    }
  };

  const handleUploadLogo = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      const res = await api.post('/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatusMessage({ type: 'success', text: 'Business logo uploaded successfully.' });
      if (res.data?.logoUrl) setLogoPreview(res.data.logoUrl);
      setSelectedFile(null);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to upload logo image.',
      });
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword || !userPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Both Admin and Staff new passwords must be provided.',
      });
      return;
    }

    try {
      await api.put('/settings/credentials', {
        adminUsername,
        adminPassword,
        userUsername,
        userPassword,
      });
      setStatusMessage({
        type: 'success',
        text: 'Credentials updated. Use the new passwords for subsequent logins.',
      });
      setAdminPassword('');
      setUserPassword('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update credentials.',
      });
    }
  };

  const handleExecutePurge = async () => {
    if (purgeConfirmText !== 'CONFIRM PURGE' || !purgeModalType) {
      return;
    }

    try {
      const res = await api.post('/settings/purge', { type: purgeModalType });
      setStatusMessage({ type: 'success', text: res.data.message || 'Data purged successfully.' });
      setPurgeModalType(null);
      setPurgeConfirmText('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to purge data.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Application Settings &amp; Maintenance</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure business print headers, security credentials, and transactional maintenance.
        </p>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-2 overflow-x-auto flex-nowrap pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Business Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security &amp; Passwords</span>
        </button>

        <button
          onClick={() => setActiveTab('purge')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'purge'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-rose-600'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Database Reset</span>
        </button>
      </div>

      {/* TAB 1: Business Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Service Center Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Address (Printed on Bills)
              </label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="e.g. No. 123, High Level Road, Colombo"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone Numbers
              </label>
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="e.g. +94 11 234 5678 / 077 123 4567"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Profile Details
            </button>
          </form>

          {/* Logo Upload Section */}
          <div className="pt-6 border-t border-slate-100 max-w-xl">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Official Logo (A4 Invoice &amp; Header)
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden p-1 shadow-inner">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      setLogoPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleUploadLogo}
                    className="block px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Confirm &amp; Upload Logo
                  </button>
                )}
                <p className="text-[11px] text-slate-400">Recommended: Square PNG / JPG, transparent background</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Security & Credentials */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-xl">
          <form onSubmit={handleSaveCredentials} className="space-y-5">
            {/* Admin Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Administrator Account (Full Access)</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Admin Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Staff Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Staff Account (POS Billing Only)</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Staff Username
                </label>
                <input
                  type="text"
                  required
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Staff Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new staff password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Update Passwords
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Maintenance & Purge */}
      {activeTab === 'purge' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 max-w-xl">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900">
              <h4 className="font-bold">Caution: Destructive Actions</h4>
              <p className="mt-1">
                Data purging wipes selected database collections permanently. Ensure you have backed up any necessary records.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-slate-900">Purge Supplier Accounts &amp; Debt</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Deletes all vendor records, supplier codes, and associated purchase invoices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPurgeModalType('suppliers');
                  setPurgeConfirmText('');
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold cursor-pointer w-full sm:w-auto"
              >
                Purge Suppliers
              </button>
            </div>

            <div className="p-4 border border-rose-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-rose-50/20">
              <div>
                <h5 className="text-xs font-bold text-rose-900">Factory Reset / Purge All Data</h5>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Deletes all customer profiles, vehicles, invoices, inventory parts, and supplier data. (Service rates catalog, vehicle types, presets, and login accounts are safely preserved).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPurgeModalType('all');
                  setPurgeConfirmText('');
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold cursor-pointer w-full sm:w-auto"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Purging */}
      <Modal
        isOpen={!!purgeModalType}
        onClose={() => setPurgeModalType(null)}
        title="Confirm Irreversible Data Purge"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          {purgeModalType === 'all' && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
              ℹ️ <strong>Note:</strong> Your Service &amp; Labour Rate Catalog, Vehicle Categories, Presets, and Admin/User logins will <strong>NOT</strong> be deleted.
            </div>
          )}

          <p className="text-xs text-slate-600">
            Please type <span className="font-mono font-bold text-rose-600">CONFIRM PURGE</span> below to confirm the wipe operation.
          </p>

          <input
            type="text"
            value={purgeConfirmText}
            onChange={(e) => setPurgeConfirmText(e.target.value)}
            placeholder="CONFIRM PURGE"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-center focus:outline-none focus:border-rose-500"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPurgeModalType(null)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={purgeConfirmText !== 'CONFIRM PURGE'}
              onClick={handleExecutePurge}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              Execute Purge
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

