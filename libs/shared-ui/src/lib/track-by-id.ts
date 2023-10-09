export function trackById<T extends { id: string }>(_: number, { id }: T) {
  return id;
}
