/**
 * utils/formatters.js
 * Shared formatting helpers used across the app.
 */

/**
 * Format an ISO date string to a locale-friendly date.
 * @param {string} dateStr - ISO 8601 date string
 * @returns {string} Formatted date or "Not Set"
 */
export function formatDate(dateStr) {
  if (!dateStr) return "Not Set";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalise(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
