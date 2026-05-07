const DEFAULT_API_BASE = "http://localhost:3000/api/v1";

export function getBackendOrigin() {
  const base = import.meta.env.VITE_API_URL || DEFAULT_API_BASE;
  try {
    const url = new URL(base);
    return url.origin;
  } catch {
    // If env is malformed, fall back to a safe default.
    return "http://localhost:3000";
  }
}

/**
 * Resolve an image path returned by the backend into a browser-loadable URL.
 *
 * Rules:
 * - null/empty => null
 * - http(s) => unchanged
 * - /uploads/... => prepend API origin derived from VITE_API_URL
 * - /assets/... or local public paths => unchanged
 * - other relative paths => null (component should render neutral fallback)
 */
export function resolveImageUrl(path) {
  if (!path || typeof path !== "string") return null;
  const p = path.trim();
  if (!p) return null;

  if (p.startsWith("http://") || p.startsWith("https://")) return p;

  if (p.startsWith("/uploads/") || p === "/uploads") {
    return `${getBackendOrigin()}${p}`;
  }

  // Vite/public paths or local assets.
  if (p.startsWith("/assets/") || p.startsWith("/")) return p;

  // Unknown relative filename (avoid accidentally pointing at Vite origin).
  return null;
}

