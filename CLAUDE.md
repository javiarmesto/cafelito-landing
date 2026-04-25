# CLAUDE.md — cafelito-landing

## Contexto del proyecto

Landing de demo para el agente de voz **Cafelito** — asesor de café single-origin con IA de voz.
Construida con **React + Vite**, integra el SDK oficial `@vocalbridgeai/react` para conectar
con el agente VocalBridge AI en tiempo real (WebRTC / LiveKit).

El widget de voz permite al usuario hablar con Cafelito, que consulta el catálogo y datos de
clientes en **Business Central** via **MCP Server** (ATICO) en tiempo real.

Proyecto desarrollado por **Javier Armesto** (VS Sistemas) como showcase demo de VocalBridge AI + BC.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 18 + Vite |
| Estilos | CSS Modules — tema glassmorphism café |
| Voice SDK | `@vocalbridgeai/react` + `@vocalbridgeai/sdk` |
| Audio | WebRTC via LiveKit (gestionado por el SDK) |
| Tipografía | Playfair Display · Lora · JetBrains Mono (Google Fonts) |
| Build | Vite — `npm run build` → `dist/` |

---

## Estructura

```
src/
├── App.jsx                        # Root — VocalBridgeProvider + layout
├── main.jsx                       # Entry point React
├── index.css                      # Variables globales + keyframes
├── data/
│   └── coffees.js                 # Catálogo de 6 orígenes (datos estáticos)
└── components/
    ├── Hero.jsx / .module.css     # Hero section con CTA
    ├── Catalogue.jsx / .module.css # Grid de tarjetas de café
    ├── CoffeeCard.jsx / .module.css # Tarjeta individual
    ├── VoiceWidget.jsx / .module.css # Modal widget de voz (SDK real)
    └── VoiceFAB.jsx / .module.css   # Floating button
```

---

## Variables CSS (tema)

```css
--bg:         #0F0804      /* fondo principal */
--bg2:        #1A0F0A
--bg3:        #241510
--gold:       #C8A97E      /* acento principal */
--gold-dim:   rgba(200,169,126,0.18)
--gold-faint: rgba(200,169,126,0.07)
--border:     rgba(200,169,126,0.12)
--text:       #E8D5B7
--muted:      rgba(200,169,126,0.55)
--espresso:   #6B4226
--cream:      #F5E6D3
```

Nunca usar colores hardcoded — siempre variables CSS.

---

## VoiceWidget — SDK hooks

```jsx
import { useVocalBridge, useTranscript } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'

const { state, connect, disconnect, isMicrophoneEnabled, toggleMicrophone, error } = useVocalBridge()
const { transcript, clear } = useTranscript()

// Estados posibles:
// ConnectionState.Disconnected | Connecting | Connected
```

El `VocalBridgeProvider` está en `App.jsx` con `options={{ auth: { tokenUrl: TOKEN_URL } }}`.
`TOKEN_URL` viene de `import.meta.env.VITE_TOKEN_URL` (`.env` local).

---

## Variable de entorno

```bash
# .env (nunca commitear)
VITE_TOKEN_URL=http://localhost:3001/api/voice-token
```

En producción apunta al backend desplegado:
```bash
VITE_TOKEN_URL=https://tu-dominio.com/api/voice-token
```

---

## Comandos

```bash
npm run dev      # desarrollo → http://localhost:5173
npm run build    # producción → dist/
npm run preview  # preview del build de producción
```

El backend (`cafelito-backend`) debe estar corriendo en `localhost:3001` para que el widget funcione.

---

## Agente Cafelito — referencia

- **Nombre**: Cafelito
- **Mode**: `openai_concierge`
- **Greeting**: "¡Buenas! Soy tu asesor de café. Cuéntame, ¿qué buscas — algo con mucho cuerpo, suave, sin cafeína...? Te ayudo a dar con el tuyo."
- **Idioma**: Español de España, tono andaluz natural
- **Herramientas BC MCP activas**:
  - `get-items` — catálogo (filtra los que empiezan por `W`)
  - `get-customers` / `get-customer`
  - `get-sales-invoices` / `get-sales-invoice`
  - `get-customer-payments` / `create-customer-payment`
  - `create-incident` / `get-incidents`
  - `validate-customer-support-status`
  - `analyze-aged-receivables`
  - `get-deliveries` / `create-delivery`

---

## Catálogo (data/coffees.js)

6 orígenes activos:

| ID | Nombre | Tipo | Precio |
|---|---|---|---|
| WRB-COL | Colombia | Whole Roasted Beans | 17,50 € |
| WRB-BRA | Brasil | Whole Roasted Beans | 18,50 € |
| WRB-ETH | Etiopía | Whole Roasted Beans | 21,00 € |
| WRB-KEN | Kenia | Whole Roasted Beans | 22,00 € |
| WDB-COL | Colombia Decaf | Whole Decaf Beans | 19,50 € |
| WRB-HAW | Hawaii | Whole Roasted Beans | 34,00 € |

Para añadir orígenes: editar `src/data/coffees.js` siguiendo la misma estructura.

---

## Claude Code plugin (VocalBridge)

```bash
/plugin marketplace add vocalbridgeai/vocal-bridge-marketplace
/plugin install vocal-bridge@vocal-bridge
/vocal-bridge:login vb_tu_api_key
/vocal-bridge:logs                  # ver transcripts de sesiones reales
/vocal-bridge:debug                 # stream en tiempo real durante pruebas
/vocal-bridge:prompt show           # ver/editar system prompt de Cafelito
/vocal-bridge:config show           # configuración completa del agente
```

---

## Tareas pendientes / posibles mejoras

- [ ] Instalar plugin VocalBridge en Claude Code y conectar a Cafelito
- [ ] Probar sesión de voz real con backend arrancado
- [ ] `useAgentActions` — manejar acción `show_product` del agente para resaltar tarjeta en catálogo
- [ ] `useAIAgent` — conectar Cafelito con lógica custom si se necesita
- [ ] Carrito de compra (estado React + BC `create-sales-order`)
- [ ] Página de producto individual con detalle expandido
- [ ] Adaptación Flutter (Android) — misma lógica, LiveKit Flutter SDK
- [ ] Deploy: Vercel (frontend) + Railway/Render (backend)

---

## Convenciones

- CSS Modules para todo — nunca estilos inline salvo layout puntual en JSX
- Variables CSS del tema, nunca colores hardcoded
- Componentes funcionales + hooks — sin clases
- Animaciones definidas en `index.css` como `@keyframes` globales, referenciadas desde módulos
- Tipografía: Playfair Display para títulos, Lora para cuerpo, JetBrains Mono para datos/código
