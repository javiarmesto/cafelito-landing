// src/App.jsx
// ─────────────────────────────────────────────
// Dos vistas:
//   · 'shop'    → la tienda (hero, orígenes, catálogo)
//   · 'counter' → «el mostrador», donde vive la conversación
//
// Al abrir la voz se entra al mostrador: la conversación
// deja de ser un modal que tapa la tienda y pasa a
// conducirla.
// ─────────────────────────────────────────────
import { useState } from 'react'
import { VocalBridgeProvider } from '@vocalbridgeai/react'
import { CartProvider } from './context/CartContext.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'
import { TelemetryProvider } from './context/TelemetryContext.jsx'
import Hero         from './components/Hero.jsx'
import OriginsMap   from './components/OriginsMap.jsx'
import Catalogue    from './components/Catalogue.jsx'
import ThemeToggle  from './components/ThemeToggle.jsx'
import Counter      from './components/Counter.jsx'
import VoiceFAB     from './components/VoiceFAB.jsx'
import CartButton   from './components/CartButton.jsx'
import CartDrawer   from './components/CartDrawer.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import AgentCartBridge from './components/AgentCartBridge.jsx'
import SessionPill  from './components/SessionPill.jsx'
import OrderToast   from './components/OrderToast.jsx'
import { IconBean } from './components/Icons.jsx'
import styles from './App.module.css'
import './index.css'

const TOKEN_URL = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3001/api/voice-token'

export default function App() {
  return (
    <VocalBridgeProvider options={{ auth: { tokenUrl: TOKEN_URL } }}>
      <CatalogProvider>
        <TelemetryProvider>
          <CartProvider>
            <Shell />
          </CartProvider>
        </TelemetryProvider>
      </CatalogProvider>
    </VocalBridgeProvider>
  )
}

function Shell() {
  const [view, setView] = useState('shop')
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState(null)

  return (
    <>
      <AgentCartBridge />

      {view === 'counter' ? (
        <Counter
          onExit={() => setView('shop')}
          onOpenCart={() => setCartOpen(true)}
          onSelectCoffee={setSelectedCoffee}
        />
      ) : (
        <>
          <nav className={styles.nav}>
            <span className={styles.brand}>
              <IconBean size={17} />
              Cafelito
            </span>

            <div className={styles.navRight}>
              <span className={styles.tagline}>single origin · specialty coffee</span>
              <SessionPill onResume={() => setView('counter')} />
              <CartButton onClick={() => setCartOpen(true)} />
              <ThemeToggle />
            </div>
          </nav>

          <Hero onChatOpen={() => setView('counter')} />
          <OriginsMap />
          <Catalogue onSelect={setSelectedCoffee} />

          <footer className={styles.footer}>
            <span>© 2026 Cafelito · VocalBridge AI + Business Central</span>
            <span className={styles.footerDim}>showcase demo · VS Sistemas</span>
          </footer>

          <VoiceFAB onClick={() => setView('counter')} />
        </>
      )}

      {selectedCoffee && (
        <ProductDetail
          coffee={selectedCoffee}
          onClose={() => setSelectedCoffee(null)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onOpenVoice={() => { setCartOpen(false); setView('counter') }}
        />
      )}

      <OrderToast />
    </>
  )
}
