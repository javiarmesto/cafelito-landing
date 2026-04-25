// src/components/OriginsMap.jsx
import styles from './OriginsMap.module.css'

const HUB = { x: 492, y: 139, label: 'España' }

const ORIGINS = [
  { id: 'COL', name: 'Colombia',  x: 294, y: 237, notes: 'Caramelo · frutos rojos' },
  { id: 'BRA', name: 'Brasil',    x: 347, y: 278, notes: 'Chocolate · nuez' },
  { id: 'ETH', name: 'Etiopía',   x: 611, y: 225, notes: 'Jazmín · melocotón' },
  { id: 'KEN', name: 'Kenia',     x: 602, y: 254, notes: 'Grosella · lima' },
  { id: 'HAW', name: 'Hawaii',    x:  64, y: 194, notes: 'Macadamia · coco' },
]

// Stylized continent silhouettes (rough blobs) — viewBox 1000x500 equirect
const CONTINENTS = [
  // North America
  'M120,80 C70,90 60,140 90,170 C100,200 140,220 200,210 C250,205 290,180 300,150 C310,120 280,85 230,75 C190,68 150,72 120,80 Z',
  // Central America strip
  'M250,210 C260,220 270,230 285,240 C295,245 305,242 310,232 C312,225 305,218 295,215 C280,210 265,208 250,210 Z',
  // South America
  'M295,235 C275,245 265,275 280,310 C295,345 320,365 340,360 C360,355 370,325 360,290 C355,265 340,245 325,238 C315,233 305,233 295,235 Z',
  // Europe
  'M460,100 C440,108 435,130 450,148 C470,160 510,162 530,150 C545,140 545,120 530,108 C510,95 480,94 460,100 Z',
  // Africa
  'M500,170 C475,180 470,215 485,255 C500,295 535,330 565,330 C595,325 615,295 620,255 C622,220 610,190 590,178 C565,165 525,162 500,170 Z',
  // Middle East / Arabia
  'M580,170 C575,185 580,205 600,212 C620,215 635,205 638,188 C640,172 625,160 605,160 C592,160 583,165 580,170 Z',
  // Asia main
  'M580,90 C540,100 530,135 555,160 C590,175 660,178 730,170 C800,162 850,140 855,115 C858,90 830,72 770,68 C700,65 620,75 580,90 Z',
  // SE Asia / Indonesia
  'M780,210 C760,215 755,230 770,240 C790,248 820,245 835,235 C848,228 845,215 830,210 C815,205 795,205 780,210 Z',
  // Australia
  'M810,330 C785,335 780,365 800,378 C830,388 875,385 890,370 C902,358 898,340 880,332 C860,325 830,325 810,330 Z',
]

export default function OriginsMap() {
  return (
    <section className={styles.section} id="origins">
      <div className={styles.header}>
        <span className={styles.eyebrow}>De la finca a tu taza</span>
        <h2 className={styles.title}>
          Seis orígenes, <em>un viaje</em>
        </h2>
        <p className={styles.subtitle}>
          Granos seleccionados directamente en finca y tostados aquí. Cada
          origen tiene una historia — Cafelito te ayuda a encontrar el tuyo.
        </p>
      </div>

      <div className={styles.mapWrap}>
        <svg className={styles.map} viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%"   stopColor="rgba(200,169,126,0.05)" />
              <stop offset="100%" stopColor="rgba(15,8,4,0)" />
            </radialGradient>
            <filter id="pinGlow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="1000" height="500" fill="url(#bgGlow)" />

          {/* Latitude / Longitude grid */}
          <g opacity="0.08" stroke="#C8A97E" strokeWidth="0.4">
            {[100, 200, 300, 400].map(y => <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} />)}
            {[200, 400, 600, 800].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" />)}
          </g>

          {/* Continents */}
          <g>
            {CONTINENTS.map((d, i) => (
              <path key={i} d={d} className={styles.continent} />
            ))}
          </g>

          {/* Routes from hub to each origin (curved) */}
          <g>
            {ORIGINS.map(o => {
              const mx = (HUB.x + o.x) / 2
              const my = Math.min(HUB.y, o.y) - 60
              return (
                <path
                  key={`r-${o.id}`}
                  d={`M${HUB.x},${HUB.y} Q${mx},${my} ${o.x},${o.y}`}
                  className={styles.route}
                />
              )
            })}
          </g>

          {/* Hub: España */}
          <g>
            <circle cx={HUB.x} cy={HUB.y} r="4.5" className={styles.hub} />
            <text x={HUB.x + 8} y={HUB.y - 6} className={styles.hubLabel}>{HUB.label}</text>
          </g>

          {/* Origins */}
          {ORIGINS.map(o => (
            <g key={o.id} className={styles.originGroup}>
              <circle cx={o.x} cy={o.y} r="10" className={styles.originRing} />
              <circle cx={o.x} cy={o.y} r="4" className={styles.origin} filter="url(#pinGlow)" />
              <text x={o.x + 10} y={o.y + 3} className={styles.label}>
                {o.name.toUpperCase()} · {o.notes}
              </text>
            </g>
          ))}
        </svg>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDotHub} /> Tueste artesano (Madrid)
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} /> Origen single-estate
          </span>
        </div>
      </div>
    </section>
  )
}
