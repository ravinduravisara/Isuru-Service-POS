import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardMetrics, Invoice } from '../types';
import {
  Users,
  Car,
  Receipt,
  Boxes,
  Truck,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle,
  Coins,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Badge } from '../components/ui/Badge';
import { InvoicePrintModal } from '../components/printing/InvoicePrintModal';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [chartData, setChartData] = useState<{ dailyTrend: any[]; paymentMethods: any[] }>({
    dailyTrend: [],
    paymentMethods: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [mRes, rRes, cRes] = await Promise.all([
        api.get('/dashboard/metrics'),
        api.get('/dashboard/recent-invoices'),
        api.get('/dashboard/charts'),
      ]);
      setMetrics(mRes.data.metrics);
      setRecentInvoices(rRes.data.invoices || []);
      setChartData(cRes.data.charts || { dailyTrend: [], paymentMethods: [] });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openInvoice = async (id: string) => {
    try {
      const res = await api.get(`/invoices/${id}`);
      setSelectedInvoice(res.data.invoice);
    } catch (err) {
      console.error('Failed to fetch invoice details', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading Operations Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Alerts if any */}
      {(metrics?.lowStockItems || 0) > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-600 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 leading-snug">
                Low Stock Warning: {metrics?.lowStockItems} Items critically low (≤ 5 units)
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Check inventory to reorder parts and maintain stock replenishment.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/inventory')}
            className="text-xs font-bold px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer w-full sm:w-auto text-center"
          >
            Review Inventory
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              LKR {(metrics?.revenue || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">All-time billed revenue</p>
          </div>
        </div>

        {/* Total Invoices */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Invoices Issued</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{metrics?.invoices || 0}</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">Completed service bills</p>
          </div>
        </div>

        {/* Total Customers & Vehicles */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Clients</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{metrics?.customers || 0}</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              {metrics?.vehicles || 0} linked vehicles on record
            </p>
          </div>
        </div>

        {/* Pending Creditors */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Unpaid Credit</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-rose-600">
              LKR {(metrics?.pendingCreditAmount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              {metrics?.pendingCreditCount || 0} unpaid customer accounts
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm sm:text-base">Service Center POS Counter</h3>
          <p className="text-xs text-blue-200 mt-0.5">
            Quickly generate a service invoice, lookup customer by phone, or register vehicles.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full md:w-auto">
          <button
            onClick={() => navigate('/billing')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Open POS Counter (F2)</span>
          </button>
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer w-full sm:w-auto"
          >
            <Users className="w-4 h-4" />
            <span>Manage Customers</span>
          </button>
          <button
            onClick={() => navigate('/inventory')}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer w-full sm:w-auto"
          >
            <Boxes className="w-4 h-4" />
            <span>Stock &amp; Parts</span>
          </button>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Daily Sales Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">30-Day Sales Trend</h4>
              <p className="text-xs text-slate-500">Daily gross invoice revenue (LKR)</p>
            </div>
          </div>
          <div className="h-64">
            {chartData.dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.dailyTrend}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`LKR ${Number(value).toLocaleString()}`, 'Sales']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No transaction data recorded in the last 30 days
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="mb-2">
            <h4 className="text-sm font-bold text-slate-900">Payment Channels</h4>
            <p className="text-xs text-slate-500">Distribution by revenue volume</p>
          </div>
          <div className="flex-1 min-h-[220px]">
            {chartData.paymentMethods.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="total"
                    nameKey="method"
                  >
                    {chartData.paymentMethods.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`LKR ${Number(value).toLocaleString()}`, 'Amount']} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No payment data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Recent Service Invoices</h4>
            <p className="text-xs text-slate-500">Latest completed billing transactions</p>
          </div>
          <button
            onClick={() => navigate('/invoices')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50/75 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Bill No</th>
                <th className="px-5 py-3">Date & Time</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Vehicle No</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Amount (LKR)</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                recentInvoices.map((inv) => (
                  <tr key={inv.id || (inv as any)._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-blue-600">
                      {inv.billNo}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(inv.dateTime).toLocaleString('en-LK', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{inv.customerName}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 text-[11px] font-semibold">
                        {inv.vehicleNo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{inv.paymentMethod}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                      {inv.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-center">
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
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => openInvoice(inv.id || (inv as any)._id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                      >
                        Print / View
                      </button>
                    </td>
                  </tr>
                ))
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

