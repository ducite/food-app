import type { Restaurant } from '../types';

/**
 * Format a number to Vietnamese Dong currency string
 * e.g., 35000 -> "35.000 đ"
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === 0) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

/**
 * Calculate the min and max price of dishes in a restaurant
 */
export function getPriceRange(restaurant: Restaurant): { min: number; max: number; text: string } | null {
  if (!restaurant.dishes || restaurant.dishes.length === 0) {
    return null;
  }

  const validPrices = restaurant.dishes
    .map(d => Number(d.price))
    .filter(p => !isNaN(p) && p > 0);

  if (validPrices.length === 0) {
    return null;
  }

  const min = Math.min(...validPrices);
  const max = Math.max(...validPrices);

  if (min === max) {
    return { min, max, text: formatVND(min) };
  }

  return {
    min,
    max,
    text: `${formatVND(min)} - ${formatVND(max)}`,
  };
}

/**
 * Generate a valid Google Maps search/open URL from address or coordinates
 */
export function formatGoogleMapsUrl(mapInput?: string, _address?: string): string | null {
  if (!mapInput || !mapInput.trim()) {
    return null;
  }

  const trimmed = mapInput.trim();

  // If already a full URL (maps.google.com, goo.gl, etc.)
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If latitude, longitude format (e.g. "21.028511, 105.854444")
  const coordsRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
  if (coordsRegex.test(trimmed)) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
  }

  // Otherwise treat as search query or place name
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}
