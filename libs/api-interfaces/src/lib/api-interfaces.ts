export interface FileStat {
  fileName: string;
  matchCount: number;
}

export interface SearchResult {
  files: FileStat[];
}
