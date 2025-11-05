export interface initialState {
  toast: { message: string; type: string } | null;
  showToast: (type: 'warn' | 'error' | 'success', message: string) => void,
  closeToast: () => void;
};
