export const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "Invalid size";
  }

  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, unitIndex);

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};