export function updateRegion({
  fileContent,
  region,
  regionContent,
}: {
  fileContent: string;
  region: string;
  regionContent: string;
}): string {
  const regionStart = `// #region ${region}`;
  const regionEnd = `// #endregion`;
  const endPattern = `${regionEnd}\n`;

  const startIndex = fileContent.indexOf(regionStart);
  const endIndex = fileContent.indexOf(endPattern, startIndex);

  if (startIndex !== -1 && endIndex !== -1) {
    fileContent =
      fileContent.slice(0, startIndex) +
      fileContent.slice(endIndex + endPattern.length);
  }

  fileContent = fileContent.trim();

  return `${fileContent}
${regionStart}
${regionContent}
${regionEnd}
`;
}
