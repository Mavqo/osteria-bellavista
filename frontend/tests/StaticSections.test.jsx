import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MenuSection from '../src/components/MenuSection.jsx'
import GallerySection from '../src/components/GallerySection.jsx'
import AboutSection from '../src/components/AboutSection.jsx'
import Footer from '../src/components/Footer.jsx'

describe('MenuSection', () => {
  it('renders all 4 categories', () => {
    render(<MenuSection />)
    expect(screen.getByText('Antipasti')).toBeInTheDocument()
    expect(screen.getByText('Primi')).toBeInTheDocument()
    expect(screen.getByText('Secondi')).toBeInTheDocument()
    expect(screen.getByText('Dolci')).toBeInTheDocument()
  })

  it('renders price range for each category', () => {
    render(<MenuSection />)
    const prices = screen.getAllByText(/€/)
    expect(prices.length).toBeGreaterThanOrEqual(4)
  })
})

describe('Static sections', () => {
  it('GallerySection renders gallery heading', () => {
    render(<GallerySection />)
    expect(screen.getByRole('region', { name: /galleria/i })).toBeInTheDocument()
  })

  it('AboutSection renders address', () => {
    render(<AboutSection />)
    expect(screen.getByText(/Via Lago 12/)).toBeInTheDocument()
  })

  it('Footer renders brand name', () => {
    render(<Footer />)
    expect(screen.getAllByText(/Osteria Bellavista/i).length).toBeGreaterThan(0)
  })
})
