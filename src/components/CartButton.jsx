// src/components/CartButton.jsx
import { useCart } from '../context/CartContext.jsx'
import styles from './CartButton.module.css'

export default function CartButton({ onClick }) {
  const { count } = useCart()

  return (
    <button className={styles.btn} onClick={onClick} title="Carrito">
      🛒
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </button>
  )
}
