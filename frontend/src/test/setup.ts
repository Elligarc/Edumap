import '@testing-library/jest-dom/vitest'

// mock ResizeObserver для jsdom
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
}
