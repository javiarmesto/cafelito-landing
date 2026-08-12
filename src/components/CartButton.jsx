// src/components/CartButton.jsx
import { useCart } from '../context/CartContext.jsx'
import { IconCart } from './Icons.jsx'
import styles from './CartButton.module.css'

export default function CartButton({ onClick }) {
  const { count } = useCart()

  return (
    <button className={styles.btn} onClick={onClick} aria-label={`Carrito, ${count} unidades`}>
      <IconCart size={17} />
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </button>
  )
}
