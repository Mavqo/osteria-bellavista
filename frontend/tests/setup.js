import '@testing-library/jest-dom'

// Mock IntersectionObserver for framer-motion whileInView
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe(el) {
    this.callback([{ isIntersecting: true, target: el }], this)
  }
  unobserve() {}
  disconnect() {}
}
