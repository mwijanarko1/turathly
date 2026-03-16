/**
 * Polyfill DOMMatrix for SSR/Node environments where pdf.js may be evaluated.
 * Must be imported before any react-pdf or pdfjs-dist imports, since pdf.js
 * uses DOMMatrix at module load time and ES module imports are hoisted.
 */
if (typeof window === "undefined" && typeof globalThis.DOMMatrix === "undefined") {
  // Minimal polyfill for pdf.js; full DOMMatrix API not needed for SSR
  (globalThis as unknown as Record<string, unknown>).DOMMatrix = class {
    constructor() {}
  };
}
