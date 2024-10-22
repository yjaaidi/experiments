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

  const startIndex = fileContent.indexOf(regionStart);
  const endIndex = fileContent.indexOf(regionEnd, startIndex);

  if (startIndex !== -1 && endIndex !== -1) {
    fileContent =
      fileContent.slice(0, startIndex + regionStart.length) +
      fileContent.slice(endIndex + regionEnd.length);
  }

  return `${fileContent}
${regionStart}
${regionContent}
${regionEnd}
`;
}
