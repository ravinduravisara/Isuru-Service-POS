import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Printer, Download, Receipt, FileText } from 'lucide-react';
import { Invoice } from '../../types';

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  businessProfile?: {
    name: string;
    address: string;
    phone: string;
  };
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  isOpen,
  onClose,
  invoice,
  businessProfile = {
    name: 'ISURU Service Center',
    address: 'Your Address Here',
    phone: '+94-000-000000',
  },
}) => {
  const [printFormat, setPrintFormat] = useState<'a4' | 'thermal'>('a4');

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isProvisional = Boolean(invoice.isProvisional || invoice.billNo?.startsWith('OFF-'));

  const formattedDate = new Date(invoice.dateTime).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print & View Invoice"
      subtitle={`Bill No: ${invoice.billNo}`}
      maxWidth={printFormat === 'thermal' ? 'md' : '3xl'}
    >
      {/* Controls & Format Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200 no-print">
        <div className="grid grid-cols-2 sm:inline-flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setPrintFormat('a4')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              printFormat === 'a4'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>A4 Document</span>
          </button>
          <button
            onClick={() => setPrintFormat('thermal')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              printFormat === 'thermal'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Thermal POS</span>
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Invoice</span>
        </button>
      </div>

      {/* Printable Body */}
      <div id="printable-invoice" className="overflow-x-auto -mx-2 sm:mx-0">
        {printFormat === 'a4' ? (
          /* ==================== A4 FORMAT ==================== */
          <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-xs text-slate-800 text-sm">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-900">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-16 h-16 object-contain rounded bg-white p-1"
                onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
              />
              <div className="flex-1">
                <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase">{businessProfile.name}</h1>
                <p className="text-xs text-slate-600">{businessProfile.address}</p>
                <p className="text-xs text-slate-600 font-mono">Tel: {businessProfile.phone}</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black tracking-widest uppercase ${isProvisional ? 'text-amber-600' : 'text-blue-900'}`}>
                  {isProvisional ? 'PROVISIONAL' : 'INVOICE'}
                </span>
                <p className="text-xs font-mono font-bold mt-1 text-slate-800">#{invoice.billNo}</p>
                {isProvisional && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">
                    OFFLINE
                  </span>
                )}
              </div>
            </div>

            {/* Provisional Alert Banner */}
            {isProvisional && (
              <div className="mt-3 p-2 bg-amber-50 border border-dashed border-amber-400 rounded-md text-amber-800 text-center font-bold text-xs uppercase tracking-wider">
                ⚠ Provisional Invoice — Saved Locally on POS (Pending Cloud Sync)
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div>
                <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Customer Details</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{invoice.customerName}</p>
                <p className="text-slate-600 font-mono">Phone: {invoice.customerPhone || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Vehicle & Date</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  {invoice.vehicleNo} <span className="font-normal text-xs text-slate-500">({invoice.vehicleType})</span>
                </p>
                <p className="text-slate-600 font-mono">Date: {formattedDate}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left my-4 border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-[11px] font-bold text-slate-900 uppercase">
                  <th className="py-2 pr-2">Service / Item</th>
                  <th className="py-2 px-2">Description</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Rate (LKR)</th>
                  <th className="py-2 pl-2 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 pr-2 font-medium text-slate-900">
                      {item.service}
                      {item.itemId && (
                        <span className="block text-[10px] font-mono text-slate-500">ID: {item.itemId}</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-slate-600">{item.description || '-'}</td>
                    <td className="py-2 px-2 text-center font-mono">{item.qty}</td>
                    <td className="py-2 px-2 text-right font-mono">{item.rate.toFixed(2)}</td>
                    <td className="py-2 pl-2 text-right font-mono font-semibold text-slate-900">
                      {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="border-t border-slate-900 pt-3 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">{invoice.subtotalAmount.toFixed(2)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span className="font-mono font-medium">-{invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-950 border-t border-slate-300 pt-2">
                  <span>Total Amount:</span>
                  <span className="font-mono text-blue-900">Rs. {invoice.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Payment:</span>
                  <span className="font-semibold uppercase text-slate-700">
                    {invoice.paymentMethod} ({invoice.paymentStatus})
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-center text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Thank you for your business!</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Please retain this bill for your service warranty & records.</p>
            </div>
          </div>
        ) : (
          /* ==================== THERMAL RECEIPT FORMAT (58/80mm Monospace) ==================== */
          <div className="bg-slate-50 p-4 border border-slate-300 rounded-md font-mono text-xs max-w-sm mx-auto shadow-inner text-slate-900 leading-tight">
            <div className="text-center font-bold">
              <p className="text-sm uppercase tracking-wider">{businessProfile.name}</p>
              <p className="text-[10px] font-normal">{businessProfile.address}</p>
              <p className="text-[10px] font-normal">Tel: {businessProfile.phone}</p>
              <p className="mt-1">----------------------------------------</p>
              <p className="font-bold">{isProvisional ? 'PROVISIONAL INVOICE (OFFLINE)' : 'INVOICE'}</p>
              {isProvisional && (
                <p className="text-[10px] text-amber-700 font-bold">* PENDING SERVER SYNC *</p>
              )}
              <p className="font-normal text-left text-[11px]">Bill: {invoice.billNo}</p>
              <p className="font-normal text-left text-[11px]">Date: {formattedDate}</p>
              <p className="font-normal text-left text-[11px]">Cust: {invoice.customerName} {invoice.customerPhone ? `(${invoice.customerPhone})` : ''}</p>
              <p className="font-normal text-left text-[11px]">Veh : {invoice.vehicleNo} ({invoice.vehicleType})</p>
              <p>----------------------------------------</p>
            </div>

            {/* Items row */}
            <div className="py-1">
              <div className="flex justify-between font-bold text-[11px]">
                <span className="w-1/2">Item</span>
                <span className="w-1/6 text-center">Qty</span>
                <span className="w-1/3 text-right">Amt</span>
              </div>
              <p>----------------------------------------</p>
              {invoice.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[11px] py-0.5">
                  <span className="w-1/2 truncate">{it.service}</span>
                  <span className="w-1/6 text-center">{it.qty}</span>
                  <span className="w-1/3 text-right">{it.amount.toFixed(2)}</span>
                </div>
              ))}
              <p>----------------------------------------</p>
            </div>

            {/* Totals */}
            <div className="space-y-0.5 text-[11px] font-bold">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>{invoice.subtotalAmount.toFixed(2)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>(-) Discount:</span>
                  <span>{invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs pt-1 border-t border-slate-400">
                <span>TOTAL:</span>
                <span>Rs. {invoice.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-normal text-slate-600">
                <span>Payment:</span>
                <span>{invoice.paymentMethod}</span>
              </div>
            </div>

            <div className="text-center mt-3 text-[11px]">
              <p>----------------------------------------</p>
              <p className="font-bold">Thank you!</p>
              <p className="text-[10px] text-slate-500">Come Again</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

