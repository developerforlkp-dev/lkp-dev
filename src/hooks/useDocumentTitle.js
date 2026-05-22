import { useEffect } from "react";

const SITE_NAME = "Little Known Planet";

/**
 * Dynamically updates the browser tab title.
 *
 * @param {string|null|undefined} title   - Primary title (e.g. entity name).
 * @param {string} [fallback]             - Section fallback (e.g. "Experiences").
 *
 * Format:
 *   - With title:    "<title> | Little Known Planet"
 *   - Fallback only: "<fallback> | Little Known Planet"
 *   - Neither:       "Little Known Planet"
 */
function useDocumentTitle(title, fallback = "") {
  useEffect(() => {
    const displayTitle = title || fallback;
    document.title = displayTitle
      ? `${displayTitle} | ${SITE_NAME}`
      : SITE_NAME;

    // Restore default on unmount
    return () => {
      document.title = SITE_NAME;
    };
  }, [title, fallback]);
}

export default useDocumentTitle;
