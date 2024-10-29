export interface LocalStorageDef {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
}
