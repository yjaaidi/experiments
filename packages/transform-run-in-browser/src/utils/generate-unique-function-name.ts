import { createHash } from 'node:crypto';

export function generateUniqueFunctionName({
  code,
  path,
}: {
  code: string;
  path: string;
}) {
  const nonWordRegex = /\W/g;
  const slug = path.replaceAll(nonWordRegex, '_');
  const hash = createHash('sha256')
    .update(code)
    .digest('base64url')
    .substring(0, 6)
    .replace(nonWordRegex, '_');
  return `${slug}_${hash}`;
}
