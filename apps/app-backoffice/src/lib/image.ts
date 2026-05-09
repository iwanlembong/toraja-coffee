import { API_URL } from "./api";

export function getImageUrl(image?: string | null) {
  if (!image) return "/placeholder.jpg";

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
}