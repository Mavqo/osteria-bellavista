import React from 'react'
import Hero from './components/Hero.jsx'

function App() {
  return (
    <>
      <Hero />

      <main>
        <section id="menu" aria-label="Il menu" />
        <section id="gallery" aria-label="Galleria" />
        <section id="booking" aria-label="Prenotazioni" />
        <section id="about" aria-label="Chi siamo e contatti" />
      </main>

      <footer id="footer" aria-label="Footer" />
    </>
  )
}

export default App
