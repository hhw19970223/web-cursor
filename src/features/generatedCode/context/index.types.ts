export type Language = "html" | "typescript"

export type GeneratedCodeStore = {
  language: Language;
  setLanguage: (language: Language) => void;

  code: string;
  setCode: (code: string) => void;
  oldCode: string;
  showDiff: boolean;

  setNewCode: (code: string) => void;
  onOk: () => void;
  onRevert: () => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;
}
