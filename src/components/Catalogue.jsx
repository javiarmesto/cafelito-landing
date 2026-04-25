// src/components/Catalogue.jsx
import { coffees } from '../data/coffees.js'
import CoffeeCard from './CoffeeCard.jsx'
import styles from './Catalogue.module.css'

export default function Catalogue() {
  return (
    <section id="catalogue" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.label}>// catálogo · 8 orígenes</div>
        <h2 className={styles.title}>Granos de especialidad</h2>
        <p className={styles.sub}>
          Pregúntale a Cafelito cuál se adapta mejor a tu paladar,
          o explora el catálogo tú mismo.
        </p>
      </div>

      <div className={styles.grid}>
        {coffees.map(coffee => (
          <CoffeeCard key={coffee.id} coffee={coffee} />
        ))}
      </div>
    </section>
  )
}
