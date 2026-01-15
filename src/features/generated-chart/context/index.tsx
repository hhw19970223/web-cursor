'use client';

import { createContext, useContext, useMemo } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';
import { GeneratedChartStore } from './index.types';

const createContextProviderStore: () => StoreApi<GeneratedChartStore> = () =>
  createStore<GeneratedChartStore>((set, get) => {
    return {
      code: ``,
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
    };
  });

const GeneratedChartStateContext = createContext<ReturnType<
  typeof createContextProviderStore
> | null>(null);

export function GeneratedChartStateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(
    () => createContextProviderStore(),
    [],
  );

  return (
    <GeneratedChartStateContext.Provider value={store}>
      {children}
    </GeneratedChartStateContext.Provider>
  );
}

export function useGeneratedChartStore<T>(
  selector: (state: GeneratedChartStore) => T,
) {
  const store = useContext(GeneratedChartStateContext);
  if (!store) {
    throw new Error(
      'useGeneratedChartParametersStore must be used within a GeneratedChartStateContextProvider',
    );
  }
  return useStore(store, selector);
}
