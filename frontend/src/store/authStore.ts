import { create } from 'zustand';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('isuru_auth_user') || 'null'),
  token: localStorage.getItem('isuru_auth_token'),
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, user } = res.data;

      localStorage.setItem('isuru_auth_token', token);
      localStorage.setItem('isuru_auth_user', JSON.stringify(user));

      set({ token, user, isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      const errorMsg =
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK' || err.message?.toLowerCase().includes('network')
          ? 'Unable to connect to server. Please verify the backend is running on port 5050.'
          : 'Login failed. Please check your credentials.');
      return {
        success: false,
        error: errorMsg,
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('isuru_auth_token');
    localStorage.removeItem('isuru_auth_user');
    set({ user: null, token: null });
    window.location.href = '/login';
  },

  checkAuth: async () => {
    const token = localStorage.getItem('isuru_auth_token');
    const storedUserStr = localStorage.getItem('isuru_auth_user');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    // Check JWT expiration safely on client
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64));
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          // Token has expired
          localStorage.removeItem('isuru_auth_token');
          localStorage.removeItem('isuru_auth_user');
          set({ user: null, token: null });
          return;
        }
      }
    } catch {
      // Malformed token
      localStorage.removeItem('isuru_auth_token');
      localStorage.removeItem('isuru_auth_user');
      set({ user: null, token: null });
      return;
    }

    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.user, token });
      localStorage.setItem('isuru_auth_user', JSON.stringify(res.data.user));
    } catch (err: any) {
      // If server explicitly rejected credentials (401 / 403), invalidate session
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('isuru_auth_token');
        localStorage.removeItem('isuru_auth_user');
        set({ user: null, token: null });
        return;
      }

      // If network failure / offline mode: retain pre-authorized session for offline POS billing
      if (storedUserStr) {
        try {
          const cachedUser = JSON.parse(storedUserStr);
          set({ user: cachedUser, token });
        } catch {
          set({ user: null, token: null });
        }
      }
    }
  },

  isAdmin: () => {
    return get().user?.role === 'Admin';
  },
}));
