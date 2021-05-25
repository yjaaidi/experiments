export function byRole(role: string) {
  return `[data-role=${encodeURIComponent(role)}]`;
}
