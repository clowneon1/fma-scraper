/**
 * Normalize Free Music Archive URLs.
 *
 * Fixes:
 * - duplicate slashes in path
 * - relative URLs
 * - ensures full FMA domain
 */

const FMA_BASE_URL = "https://freemusicarchive.org";

function normalizeUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  let normalized = url.trim();

  // Convert relative URL → absolute
  if (!normalized.startsWith("http")) {
    normalized = FMA_BASE_URL + normalized;
  }

  // Remove duplicate slashes except protocol
  normalized = normalized.replace(/([^:]\/)\/+/g, "$1");

  return normalized;
}

module.exports = {
  normalizeUrl,
};
