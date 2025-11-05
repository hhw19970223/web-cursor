import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialState } from './index.types';

export const LOGIN_STORE_NAME = 'login-store';

export const useLoginStore = create<initialState>()(
  persist(
    (set) => ({
      loginInfo: null,
      cursorUser: null,
      cookie: '',
      email: '',
    }),
    {
      name: LOGIN_STORE_NAME,
      partialize: (state) => ({
        loginInfo: state.loginInfo,
        cursorUser: state.cursorUser,
        email: '',
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
