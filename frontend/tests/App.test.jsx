import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../src/App.jsx'

describe('App scaffold', () => {
  it('renders without crashing', () => {
    render(<App />)
  })

  it('contains all required section ids', () => {
    const { container } = render(<App />)
    const ids = ['hero', 'menu', 'gallery', 'booking', 'about', 'footer']
    ids.forEach(id => {
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    })
  })
})
