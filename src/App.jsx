import React from 'react'
import { Helmet } from 'react-helmet-async'
import DevStatus from './components/DevStatus.jsx'

export default function App(){
  return (
    <div>
      <Helmet>
        <title>Epoch Voyages — Luxury Travel Design</title>
        <meta name="description" content="Epoch Voyages crafts bespoke journeys in art, culture, history, and gastronomy." />
        <link rel="icon" href="/EV_Logo.png" type="image/png" />
        <html lang="en" />
      </Helmet>

      <header className="container header">
        <img src="/EV_Logo.png" alt="Epoch Voyages" className="logo" />
        <div style={{fontSize:14, color:'#666'}}>
          eric@epochvoyages.com • (651) 387-6782
        </div>
      </header>

      <main className="container">
        <section className="kv hero">
          <h1>Travel that honors the past and elevates the present.</h1>
          <p style={{maxWidth:700, fontSize:18, lineHeight:1.6}}>
            Epoch Voyages designs private, culturally-rich itineraries in Europe and beyond —
            centered on art, history, and exceptional dining.
          </p>
          <a className="cta" href="mailto:eric@epochvoyages.com?subject=Epoch%20Voyages%20Consult">Start a conversation</a>
        </section>
      </main>

      <footer className="container footer">
        <div>© {new Date().getFullYear()} Epoch Voyages • <a href="mailto:eric@epochvoyages.com">eric@epochvoyages.com</a></div>
      </footer>

      <DevStatus />
    </div>
  )
}
