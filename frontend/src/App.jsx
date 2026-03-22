import React from 'react'

function App() {
  return (
    <>
      <nav id="nav" aria-label="Navigazione principale">
        {/* populated in Task 8 alongside Hero */}
      </nav>

      <main>
        <section id="hero" aria-label="Hero" />
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
