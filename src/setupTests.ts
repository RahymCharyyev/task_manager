import '@testing-library/jest-dom';
// Polyfill Ant Design expectations in jsdom.
const originalGetComputedStyle = window.getComputedStyle;

window.getComputedStyle = (elt: Element) =>
  originalGetComputedStyle(elt, undefined);

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
