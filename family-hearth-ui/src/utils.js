const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const getMediaUrl = (path) => {
  if (!path) {
    return null;
  }
  // If path is already a full URL, return it as is.
  if (path.startsWith('http')) {
    return path;
  }
  // Otherwise, prepend the API_URL.
  // In development, API_URL is empty, so this returns '/media/files/10.jpg' (handled by proxy).
  // In production, API_URL would be 'https://your-backend.com', returning the full URL.
  return `${API_URL}${path}`;
};
