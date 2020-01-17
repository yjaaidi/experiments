
export interface Line {
  content: string;
  file: string;
  number: number;
}

export interface SearchResult {
  items: Line[];
}
