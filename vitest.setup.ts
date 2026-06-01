import "@testing-library/jest-dom/vitest";

// JSDOM doesn't implement scrollIntoView; section commands call it.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// JSDOM doesn't implement matchMedia; the Terminal reads it to decide
// whether to autofocus on mount. Default to "not a coarse-pointer device"
// so tests behave like a desktop browser.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
