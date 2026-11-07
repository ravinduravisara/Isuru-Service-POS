import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProfitStatement } from '../types';
import {
  TrendingUp,
  Printer,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const ProfitStatementPage: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(todayStr);
  const [statement, setStatement] = useState<ProfitStatement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfitStatement();
  }, []);

  const fetchProfitStatement = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      const res = await api.get(`/profit-statement?${params.toString()}`);
      setStatement(res.data.statement);
    } catch (err) {
      console.error('Failed to load profit statement', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (preset: 'today' | '7days' | 'month' | 'year' | 'all') => {
    const now = new Date();
    let start = new Date();
    const end = new Date();

    if (preset === 'today') {
      start = new Date();
    } else if (preset === '7days') {
      start.setDate(now.getDate() - 7);
    } else if (preset === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (preset === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (preset === 'all') {
      start = new Date(2020, 0, 1);
    }

    setFromDate(start.toISOString().split('T')[0]);
    setToDate(end.toISOString().split('T')[0]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Print Control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Profit &amp; Loss Statement</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit itemized billing profitability, frozen inventory cost basis, and vendor purchase reconciliation.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Financial Statement</span>
        </button>
      </div>

      {/* Date Filter & Preset Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 no-print">
        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap sm:flex-wrap pb-1.5 sm:pb-0">
          <button
            onClick={() => handleApplyPreset('today')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            Today
          </button>
          <button
            onClick={() => handleApplyPreset('7days')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleApplyPreset('month')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            This Month
          </button>
          <button
            onClick={() => handleApplyPreset('year')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            This Year
          </button>
          <button
            onClick={() => handleApplyPreset('all')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            All Time
          </button>
        </div>

        {/* Date Pickers & Fetch CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 overflow-x-auto">
            <span className="font-semibold text-slate-500 text-[11px]">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <span className="font-semibold text-slate-500 text-[11px]">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={fetchProfitStatement}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto text-center"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Printable Statement Header (Visible only when printing or at top) */}
      <div className="hidden print:block mb-4 border-b border-slate-900 pb-3">
        <h1 className="text-xl font-black">ISURU SERVICE CENTER</h1>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Official Profit &amp; Loss Financial Report
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Period: {statement?.from} to {statement?.to} • Generated: {new Date().toLocaleString('en-LK')}
        </p>
      </div>

      {/* Financial Breakdown Cards */}
      {statement && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Sales Revenue */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Total Sales Revenue</span>
            <p className="text-base sm:text-xl font-black text-slate-900 mt-1 font-mono truncate">
              LKR {statement.totalSalesRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-1 text-[10px] sm:text-[11px] text-slate-500 flex flex-col sm:flex-row sm:justify-between">
              <span>Labour: {statement.serviceRevenue.toLocaleString()}</span>
              <span>Parts: {statement.partsRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Cost of Goods Sold (COGS) */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Cost of Goods Sold (COGS)</span>
            <p className="text-base sm:text-xl font-black text-slate-700 mt-1 font-mono truncate">
              LKR {statement.cogs.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">Frozen cost basis of sold parts</p>
          </div>

          {/* Gross Profit */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Gross Profit</span>
              <Badge variant={statement.grossProfit >= 0 ? 'success' : 'danger'}>
                {statement.profitMargin}%
              </Badge>
            </div>
            <p className="text-base sm:text-xl font-black text-emerald-600 mt-1 font-mono truncate">
              LKR {statement.grossProfit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">Sales Revenue - COGS</p>
          </div>

          {/* Net Profit After Purchases */}
          <div
            className={`p-3.5 sm:p-4 rounded-xl border shadow-xs ${
              statement.netProfitAfterPurchases >= 0
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/50 border-rose-200 text-rose-950'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-75">
              Net Profit (After Purchases)
            </span>
            <p
              className={`text-base sm:text-xl font-black mt-1 font-mono truncate ${
                statement.netProfitAfterPurchases >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              LKR {statement.netProfitAfterPurchases.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] sm:text-[11px] opacity-75 mt-1 truncate">
              Purchases: LKR {statement.totalPurchases.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Itemized Profit Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Itemized Billing Profit Breakdown</h4>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Each line item audited with selling rate, buying cost, and generated margin
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            {statement?.linesCount || 0} Lines
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Bill No</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Service / Item</th>
                <th className="px-4 py-3 text-center w-12">Qty</th>
                <th className="px-4 py-3 text-right">Selling Rate</th>
                <th className="px-4 py-3 text-right">Cost Rate</th>
                <th className="px-4 py-3 text-right">Revenue (LKR)</th>
                <th className="px-4 py-3 text-right">COGS (LKR)</th>
                <th className="px-4 py-3 text-right">Profit (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : !statement || statement.lines.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                    No billing transactions recorded in this date range.
                  </td>
                </tr>
              ) : (
                statement.lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(line.date).toLocaleDateString('en-LK')}
                    </td>
                    <td className="px-4 py-2.5 font-bold font-mono text-blue-600">{line.invoiceNo}</td>
                    <td className="px-4 py-2.5 font-medium">{line.customerName}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px]">{line.vehicleNo}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-slate-900">{line.service}</span>
                      {line.itemId && (
                        <span className="block text-[10px] text-blue-600 font-mono">
                          [{line.itemId}] {line.description}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold">{line.qty}</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {line.sellingPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">
                      {line.buyingPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      {line.revenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-600">
                      {line.cost.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-mono font-black ${
                        line.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {line.profit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

