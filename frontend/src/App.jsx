import React from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import MenuSection from './components/MenuSection.jsx'
import GallerySection from './components/GallerySection.jsx'
import BookingSection from './components/BookingSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <MenuSection />
        <GallerySection />
        <BookingSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}

export default App
