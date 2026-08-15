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
export const formatMessageTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Future date
  if (diffMs < 0) {
    return "just now";
  }

  // Less than 10 minutes
  if (diffMinutes < 10) {
    if (diffMinutes === 0) {
      return "just now";
    }

    return `${diffMinutes}m ago`;
  }

  // Less than 1 hour
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  // Less than 24 hours
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  // Yesterday
  if (diffDays === 1) {
    return `yesterday ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(" ", "").toLowerCase()}`;
  }

  // Older than yesterday
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(" ", " ").toLowerCase();
};