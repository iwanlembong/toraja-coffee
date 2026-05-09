import { API_URL } from "@/lib/api";

export function getImageUrl(path?: string) {
  if (!path) return "/placeholder.jpg";

  // kalau sudah full URL
  if (path.startsWith("http")) return path;

  // pastikan slash aman
  return `${API_URL}${path}`;
}