import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../src/components/Navbar.jsx'

describe('Navbar', () => {
  it('renders brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Osteria Bellavista')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /menu/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /prenota/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contatti/i })).toBeInTheDocument()
  })

  it('renders hamburger button on mobile (aria)', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
  })
})
