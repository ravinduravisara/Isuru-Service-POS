import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, ShieldCheck, UserCheck, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isAdmin } = useAuthStore();
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
        return { title: 'Dashboard', subtitle: 'Overview of service station operations' };
      case '/billing':
        return { title: 'POS Billing Counter', subtitle: 'Counter invoices & real-time stock deductions' };
      case '/invoices':
        return { title: 'Invoices & Creditors', subtitle: 'Billing history & credit settlement' };
      case '/customers':
        return { title: 'Customers & Vehicles', subtitle: 'Client registry & vehicle profiles' };
      case '/services':
        return { title: 'Service Rates', subtitle: 'Fixed labor charges by vehicle category' };
      case '/inventory':
        return { title: 'Inventory & Stock', subtitle: 'Parts, stock balance & cost basis' };
      case '/suppliers':
        return { title: 'Suppliers Ledger', subtitle: 'Vendor balances & accounts payable' };
      case '/supply-invoices':
        return { title: 'Supply Purchases', subtitle: 'Incoming shipments & cheque tracking' };
      case '/profit':
        return { title: 'Profit & Loss', subtitle: 'Revenue, COGS & net margins' };
      case '/settings':
        return { title: 'Settings', subtitle: 'Workshop details, logo & passwords' };
      default:
        return { title: 'ISURU Service Center', subtitle: 'Workshop Management' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title & Subtitle */}
        <div className="truncate">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight leading-none truncate">
            {title}
          </h2>
          <p className="text-[11px] text-slate-500 mt-1 hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {location.pathname !== '/billing' && (
          <Link
            to="/billing"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">POS Bill</span>
          </Link>
        )}

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs uppercase shadow-xs">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
              {user?.fullName || user?.username}
            </p>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              {isAdmin() ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-amber-500" /> Admin
                </>
              ) : (
                <>
                  <UserCheck className="w-3 h-3 text-emerald-500" /> Staff
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
