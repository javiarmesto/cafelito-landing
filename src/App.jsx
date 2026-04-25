// src/App.jsx
// ─────────────────────────────────────────────
// TOKEN_URL apunta al backend Express que ya tienes.
// En desarrollo: http://localhost:3001/api/voice-token
// En producción: https://tu-dominio.com/api/voice-token
// ─────────────────────────────────────────────
import { useState } from 'react'
import { VocalBridgeProvider } from '@vocalbridgeai/react'
import Hero         from './components/Hero.jsx'
import OriginsMap   from './components/OriginsMap.jsx'
import Catalogue    from './components/Catalogue.jsx'
import ThemeToggle  from './components/ThemeToggle.jsx'
import VoiceWidget from './components/VoiceWidget.jsx'
import VoiceFAB  from './components/VoiceFAB.jsx'
import './index.css'

const TOKEN_URL = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3001/api/voice-token'

export default function App() {
  const [widgetOpen, setWidgetOpen] = useState(false)

  return (
    <VocalBridgeProvider options={{ auth: { tokenUrl: TOKEN_URL } }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface-strong)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 20, fontWeight: 700, color: 'var(--gold)',
        }}>
          ☕ Cafelito
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, color: 'var(--muted)',
            letterSpacing: '0.08em',
          }}>
            single origin · specialty coffee
          </span>
          <ThemeToggle />
        </div>
      </nav>

      {/* Page */}
      <Hero onChatOpen={() => setWidgetOpen(true)} />
      <OriginsMap />
      <Catalogue />

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)',
        padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
          © 2026 Cafelito · powered by VocalBridge AI + Business Central
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', opacity: 0.7 }}>
          showcase demo · VS Sistemas
        </span>
      </footer>

      {/* Voice widget (modal) */}
      {widgetOpen && (
        <VoiceWidget onClose={() => setWidgetOpen(false)} />
      )}

      {/* Floating button */}
      <VoiceFAB
        onClick={() => setWidgetOpen(o => !o)}
        isOpen={widgetOpen}
      />

    </VocalBridgeProvider>
  )
}
