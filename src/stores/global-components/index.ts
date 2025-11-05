import { create } from 'zustand';
import { initialState } from './index.types';

export const useGlobalComponentsStore = create<initialState>()(
  (set) => ({
    toast: null,
    showToast: (type: 'warn' | 'error' | 'success', message: string) => set({ toast: { type, message }}),
    closeToast: () => set({ toast: null }),
  }),
);
