import React from 'react'
import Hero from './components/Hero.jsx'
import MenuSection from './components/MenuSection.jsx'
import GallerySection from './components/GallerySection.jsx'
import AboutSection from './components/AboutSection.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Hero />

      <main>
        <MenuSection />
        <GallerySection />
        <section id="booking" aria-label="Prenotazioni" />
        <AboutSection />
      </main>

      <Footer />
    </>
  )
}

export default App
