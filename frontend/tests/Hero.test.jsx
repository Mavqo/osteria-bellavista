import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '../src/components/Hero.jsx'

describe('Hero', () => {
  it('renders the restaurant name', () => {
    render(<Hero />)
    expect(screen.getByText('Osteria Bellavista')).toBeInTheDocument()
  })

  it('renders the CTA link pointing to #booking', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: /prenota un tavolo/i })
    expect(cta).toBeInTheDocument()
    expect(cta.getAttribute('href')).toBe('#booking')
  })
})
