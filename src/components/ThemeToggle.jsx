// src/components/ThemeToggle.jsx
import { useEffect, useState } from 'react'
import { IconSun, IconMoon } from './Icons.jsx'
import styles from './ThemeToggle.module.css'

const STORAGE_KEY = 'cafelito-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  const isLight = theme === 'light'

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Cambiar a tema ${isLight ? 'oscuro' : 'claro'}`}
      title={isLight ? 'Modo oscuro' : 'Modo claro'}
    >
      <span className={`${styles.icon} ${!isLight ? styles.iconActive : ''}`}>
        <IconSun size={12} />
      </span>
      <span className={`${styles.icon} ${isLight ? styles.iconActive : ''}`}>
        <IconMoon size={12} />
      </span>
      <span className={`${styles.knob} ${isLight ? styles.knobLight : ''}`}>
        {isLight ? <IconSun size={12} /> : <IconMoon size={12} />}
      </span>
    </button>
  )
}
