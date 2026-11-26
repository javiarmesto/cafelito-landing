import { useEffect, useState } from 'react'
import { formatPrice } from '../data/money.js'
import styles from './CoffeeReleases.module.css'

const tokenURL = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3001/api/voice-token'
const defaultReleasesURL = new URL(tokenURL, window.location.origin)
defaultReleasesURL.pathname = defaultReleasesURL.pathname.replace(/\/api\/voice-token\/?$/, '/api/catalog/releases')
defaultReleasesURL.search = ''
defaultReleasesURL.hash = ''
const releasesURL = new URL(import.meta.env.VITE_CAFELITO_RELEASES_URL || defaultReleasesURL.href, window.location.origin)

export default function CoffeeReleases() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetch(releasesURL, { signal: controller.signal, cache: 'no-store' })
      .then(async res => {
        if (!res.ok) throw new Error('Catalog unavailable')
        const data = await res.json()
        if (!Array.isArray(data.items)) throw new Error('Invalid catalog')
        if (!controller.signal.aborted) {
          setItems(data.items)
          setStatus('ready')
        }
      }).catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => controller.abort()
  }, [revision])

  function reload() {
    setStatus('loading')
    setRevision(value => value + 1)
  }

  return (
    <section className={styles.releases} aria-label="Nuevas incorporaciones">
      <div className={styles.heading}>
        <h3>Nuevas incorporaciones</h3>
        <button onClick={reload} disabled={status === 'loading'}>Actualizar</button>
      </div>
      <div role="status">
        {status === 'loading' && 'Consultando Business Central…'}
        {status === 'error' && 'No se pudo consultar el catálogo de Business Central.'}
        {status === 'ready' && !items.length && 'Todavía no hay cafés publicados.'}
      </div>
      {status === 'ready' && <div className={styles.grid}>{items.map(item => (
        <article key={item.id} className={styles.product}>
          <img key={revision} src={new URL(item.picture, releasesURL).href} alt={'Envase de ' + item.name}
            loading="lazy" onError={event => { event.currentTarget.hidden = true }} />
          <p>{item.number}</p>
          <h4>{item.name}</h4>
          {item.description && <p>{item.description}</p>}
          <p><strong>{formatPrice(item.price)}</strong> / {item.unit}</p>
          <small>{item.includesTax ? 'Impuestos incluidos' : 'Antes de impuestos'}</small>
          <p>{item.stock > 0 ? item.stock + ' bolsas en existencias' : 'Sin existencias'}</p>
        </article>
      ))}</div>}
    </section>
  )
}
