let index = 0;
export function generateId(prefix: string) {
  return `${prefix}_${index++}`;
}
