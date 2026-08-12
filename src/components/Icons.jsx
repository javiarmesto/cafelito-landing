// src/components/Icons.jsx
// ─────────────────────────────────────────────
// Sistema de iconos propio. Sustituye a los emoji
// del chrome (☕ 🛒 🎤 ✕): los emoji se dibujan
// distinto en cada sistema operativo y rebajan el
// acabado de una demo comercial.
//
// Todos heredan currentColor y el tamaño por `size`.
// ─────────────────────────────────────────────

function Svg({ size = 18, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/** Grano de café — marca de Cafelito.
 *  La hendidura va en S y sin tocar el contorno: una línea recta de borde
 *  a borde convierte el grano en un símbolo de «prohibido». */
export function IconBean({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M12 2.6c3.7 2.5 5.5 5.7 5.5 9.4s-1.8 6.9-5.5 9.4c-3.7-2.5-5.5-5.7-5.5-9.4S8.3 5.1 12 2.6z" />
      <path d="M12 6.2c-1.5 2.3-1.5 4.2 0 5.9s1.5 3.6 0 5.9" />
    </Svg>
  )
}

/** Micrófono */
export function IconMic({ size = 18 }) {
  return (
    <Svg size={size}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <path d="M12 18v3.5" />
    </Svg>
  )
}

/** Micrófono silenciado */
export function IconMicOff({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M15 5v-.5a3 3 0 0 0-6 0V11" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 10.2 5.3" />
      <path d="M18.5 11.5a6.5 6.5 0 0 1-.4 2.2" />
      <path d="M12 18v3.5" />
      <path d="M3.5 3.5l17 17" />
    </Svg>
  )
}

/** Carrito */
export function IconCart({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M2.5 3.5h2.2l2.1 10.4a1.8 1.8 0 0 0 1.8 1.4h8.1a1.8 1.8 0 0 0 1.8-1.4l1.3-6.4H6" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </Svg>
  )
}

/** Cerrar */
export function IconClose({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </Svg>
  )
}

/** Confirmación */
export function IconCheck({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Svg>
  )
}

/** Flecha (volver / navegar) */
export function IconArrowLeft({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M19 12H5.5M11 5.5L4.5 12l6.5 6.5" />
    </Svg>
  )
}

/** Enviar / entrar */
export function IconArrowRight({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M5 12h13.5M13 5.5l6.5 6.5-6.5 6.5" />
    </Svg>
  )
}

/** Papelera */
export function IconTrash({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M3.5 6.5h17M9 6.5V4.2A1.7 1.7 0 0 1 10.7 2.5h2.6A1.7 1.7 0 0 1 15 4.2v2.3" />
      <path d="M5.8 6.5l1 13a1.8 1.8 0 0 0 1.8 1.7h6.8a1.8 1.8 0 0 0 1.8-1.7l1-13" />
    </Svg>
  )
}

/** Enlace de datos — usado en la telemetría */
export function IconPlug({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M9 2.5v5M15 2.5v5" />
      <path d="M6 7.5h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6z" />
      <path d="M12 16.5v5" />
    </Svg>
  )
}

/** Sol / luna para el tema */
export function IconSun({ size = 18 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
    </Svg>
  )
}

export function IconMoon({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </Svg>
  )
}
