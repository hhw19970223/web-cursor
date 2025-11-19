'use client';

import { createContext, useContext, useMemo } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';
import { GeneratedCodeStore, Language } from './index.types';

const createContextProviderStore: () => StoreApi<GeneratedCodeStore> = () =>
  createStore<GeneratedCodeStore>((set, get) => {
    return {
      language: 'html',
      setLanguage: (language: Language) => {
        set({ language });
      },
      code: '',
      setCode: (code: string) => {
        set({ code });
      },
      showDiff: false,
      oldCode: '',

      setNewCode: (value) => {
        const { code } = get();
        set({ code: value,  oldCode: code, showDiff: true });
      },
      onOk: () => {
        set({ oldCode: '', showDiff: false });
      },
      onRevert: () => {
        const { oldCode } = get();
        set({ code: oldCode,  oldCode: '', showDiff: false });
      },

      loading: false,
      setLoading: (value) => {
        set({ loading: value });
      },
    };
  });

const GeneratedCodeStateContext = createContext<ReturnType<
  typeof createContextProviderStore
> | null>(null);

export function GeneratedCodeStateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(
    () => createContextProviderStore(),
    [],
  );

  return (
    <GeneratedCodeStateContext.Provider value={store}>
      {children}
    </GeneratedCodeStateContext.Provider>
  );
}

export function useGeneratedCodeStore<T>(
  selector: (state: GeneratedCodeStore) => T,
) {
  const store = useContext(GeneratedCodeStateContext);
  if (!store) {
    throw new Error(
      'useGeneratedCodeParametersStore must be used within a GeneratedCodeStateContextProvider',
    );
  }
  return useStore(store, selector);
}
