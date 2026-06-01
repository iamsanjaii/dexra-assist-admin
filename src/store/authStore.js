import { create } from 'zustand';
import { apiInit } from '../api/apiInit';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const api = apiInit();
      const { data } = await api.get('/auth/me');
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      const api = apiInit();
      await api.post('/auth/logout');
    } catch (e) {}
    set({ user: null, isAuthenticated: false });
  },
}));
