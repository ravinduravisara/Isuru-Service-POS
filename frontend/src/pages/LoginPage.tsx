import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, User, Eye, EyeOff, Wrench, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    const res = await login(username.trim(), password.trim());
    if (res.success) {
      navigate('/');
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const fillCredentials = (userVal: string, passVal: string) => {
    setUsername(userVal);
    setPassword(passVal);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background radial gradients for sleek enterprise feel */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-600/20 text-blue-500 border border-blue-500/30 mb-3 sm:mb-4 shadow-lg shadow-blue-500/10">
            <Wrench className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">ISURU SERVICE CENTER</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Enterprise Billing & Workshop Management
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In to System</span>
            )}
          </button>
        </form>

        {/* Quick Credentials / Demo Fill */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400 text-center uppercase tracking-wider mb-3">
            Quick Fill Access Credentials
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => fillCredentials('Isuru@6800', 'Isuru@service')}
              className="flex items-center justify-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-300 transition-colors cursor-pointer group"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="font-semibold block leading-none">Admin</span>
                <span className="text-[10px] text-slate-500">Full Rights</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('User@123', 'User@service')}
              className="flex items-center justify-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-300 transition-colors cursor-pointer group"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="font-semibold block leading-none">Staff</span>
                <span className="text-[10px] text-slate-500">Billing Only</span>
              </div>
            </button>
          </div>
        </div>

        {/* System Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-600">
            Offline Production Billing System • Local Database Verified
          </p>
        </div>
      </div>
    </div>
  );
};

