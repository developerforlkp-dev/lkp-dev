/**
 * Smoothly scrolls a horizontal container so that the specified element is centered
 * within the visible container bounds.
 *
 * Designed for professional carousels:
 * - Operates strictly on horizontal scroll without affecting page vertical position.
 * - Temporarily disables CSS scroll-snap during animation to prevent browser jitter or fight.
 * - Safely restores CSS scroll-snap once the smooth glide completes.
 *
 * @param {HTMLElement} element - The DOM element to center
 * @param {Object} [options]
 * @param {string} [options.behavior='smooth']
 * @param {number} [options.delay=0]
 */
export const scrollElementToCenter = (element, options = {}) => {
  if (!element || typeof window === "undefined") return;

  const { behavior = "smooth", delay = 0 } = options;

  const performScroll = () => {
    if (!element || !element.isConnected) return;

    // Locate the scroll container
    let container = element.closest(
      '[class*="scrollWrapper"], [class*="horizontalScroll"], [class*="mobileCategoriesScroll"]'
    );

    if (!container) {
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        if (style.overflowX === "auto" || style.overflowX === "scroll") {
          container = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }

    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Center of element relative to viewport vs center of container relative to viewport
    const elementCenter = elementRect.left + elementRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const diff = elementCenter - containerCenter;

    // If already centered within 2px, nothing to do
    if (Math.abs(diff) < 2) return;

    // Temporarily disable scroll-snap during programmatic smooth scroll
    if (container.__snapRestoreTimeout) {
      clearTimeout(container.__snapRestoreTimeout);
    }
    if (container.__originalSnapType === undefined) {
      container.__originalSnapType = container.style.scrollSnapType || "";
    }
    container.style.scrollSnapType = "none";

    container.scrollBy({
      left: diff,
      behavior,
    });

    // Re-enable scroll snap after transition finishes
    container.__snapRestoreTimeout = setTimeout(() => {
      if (container) {
        container.style.scrollSnapType = container.__originalSnapType || "";
        delete container.__originalSnapType;
        delete container.__snapRestoreTimeout;
      }
    }, 450);
  };

  if (delay > 0) {
    setTimeout(() => {
      requestAnimationFrame(performScroll);
    }, delay);
  } else {
    requestAnimationFrame(performScroll);
  }
};
