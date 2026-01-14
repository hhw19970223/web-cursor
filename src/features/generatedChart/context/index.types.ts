export type GeneratedChartStore = {
  code: string;
  setCode: (code: string) => void;
  oldCode: string;
  showDiff: boolean;

  setNewCode: (code: string) => void;
  onOk: () => void;
  onRevert: () => void;
}
