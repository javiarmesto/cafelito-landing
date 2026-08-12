// src/components/Counter.jsx
// ─────────────────────────────────────────────
// «El mostrador» — la vista donde vive la conversación.
// Dos columnas: hablas a la izquierda, el catálogo
// reacciona a la derecha, y abajo se ve el canal de
// datos con el agente.
//
// Sustituye al antiguo modal de voz: la conversación
// ya no tapa la tienda, la conduce.
// ─────────────────────────────────────────────
import ConversationPanel from './ConversationPanel.jsx'
import LiveCatalogue from './LiveCatalogue.jsx'
import TelemetryRail from './TelemetryRail.jsx'
import CartButton from './CartButton.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { IconArrowLeft, IconBean } from './Icons.jsx'
import styles from './Counter.module.css'

export default function Counter({ onExit, onOpenCart, onSelectCoffee }) {
  return (
    <div className={styles.counter}>
      <nav className={styles.nav}>
        <button className={styles.back} onClick={onExit}>
          <IconArrowLeft size={15} />
          Volver a la tienda
        </button>

        <span className={styles.brand}>
          <IconBean size={15} />
          Cafelito
        </span>

        <div className={styles.navRight}>
          <CartButton onClick={onOpenCart} />
          <ThemeToggle />
        </div>
      </nav>

      <div className={styles.stage}>
        <ConversationPanel />
        <LiveCatalogue onSelect={onSelectCoffee} />
      </div>

      <TelemetryRail />
    </div>
  )
}
