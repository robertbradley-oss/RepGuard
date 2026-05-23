export function formatFileSize(bytes: number) {
  const sizeInKb = bytes / 1024;

  if (sizeInKb < 1024) {
    return `${Math.max(1, Math.round(sizeInKb))} KB`;
  }

  const sizeInMb = sizeInKb / 1024;

  return `${sizeInMb.toFixed(sizeInMb > 9.9 ? 0 : 1)} MB`;
}
