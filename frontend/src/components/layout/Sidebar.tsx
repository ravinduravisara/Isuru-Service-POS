import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Users,
  Wrench,
  Boxes,
  Truck,
  ShoppingBag,
  TrendingUp,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user, isAdmin, logout } = useAuthStore();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/billing', label: 'POS Billing', icon: Receipt, highlight: true },
    { to: '/invoices', label: 'Invoices & History', icon: FileText },
    { to: '/customers', label: 'Customers & Vehicles', icon: Users },
    { to: '/services', label: 'Service Rates', icon: Wrench },
    { to: '/inventory', label: 'Inventory & Stock', icon: Boxes },
    { to: '/suppliers', label: 'Suppliers', icon: Truck },
    { to: '/supply-invoices', label: 'Supply Purchases', icon: ShoppingBag },
    ...(isAdmin()
      ? [
          { to: '/profit', label: 'Profit Statement', icon: TrendingUp },
          { to: '/settings', label: 'Settings', icon: Settings },
        ]
      : []),
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-9 h-9 object-contain rounded-md bg-white p-0.5 shadow-sm"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white leading-tight">ISURU SERVICE</h1>
            <p className="text-[11px] text-blue-400 font-medium">Billing &amp; Management</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  item.highlight
                    ? isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20'
                    : isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-inner'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.highlight && (
                <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  POS
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Role Badge Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user?.fullName || user?.username}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.username}</p>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isAdmin()
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {user?.role}
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 min-h-screen border-r border-slate-800 shadow-xl z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <aside className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
