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
├── App.jsx                        # Root — VocalBridgeProvider + CartProvider + layout
├── main.jsx                       # Entry point React
├── index.css                      # Variables globales + keyframes
├── context/
│   ├── CartContext.jsx            # Estado global carrito (CartProvider + useCart + lastOrder)
│   └── CatalogContext.jsx         # Catálogo con stock real de BC vía /api/catalog (fallback estático)
├── data/
│   └── coffees.js                 # Catálogo de 6 orígenes + resolveCoffee (matching flexible)
└── components/
    ├── Hero.jsx / .module.css     # Hero section con CTA
    ├── Catalogue.jsx / .module.css # Grid de tarjetas + acciones show_product/view_product
    ├── CoffeeCard.jsx / .module.css # Tarjeta individual (click → detalle, Añadir → carrito)
    ├── ProductDetail.jsx / .module.css # Modal detalle expandido (región/altitud/proceso)
    ├── CartButton.jsx / .module.css # Botón carrito navbar con badge
    ├── CartDrawer.jsx / .module.css # Drawer lateral carrito + checkout por voz
    ├── AgentCartBridge.jsx        # Puente carrito ↔ agente (add_to_cart, cart_updated, order_created…)
    ├── OrderToast.jsx / .module.css # Confirmación visual de pedido creado en BC
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
import { useVocalBridge, useTranscript, useAgentActions } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'

const {
  state, connect, disconnect,
  isMicrophoneEnabled, toggleMicrophone,
  agentMode,          // mode del agente (del token response) — se muestra en el header
  error,
} = useVocalBridge()
const { transcript, clear } = useTranscript()   // entries con { role, text, timestamp }

// Estados posibles (todos manejados en VoiceWidget):
// ConnectionState.Disconnected | Connecting | WaitingForAgent | Connected | Reconnecting | Disconnecting
```

## Acciones bidireccionales (useAgentActions)

Implementadas en `Catalogue.jsx`:

- **agente → UI**: acción `show_product` — resalta la tarjeta del café (glow dorado 6s)
  y hace scroll hasta ella. El payload acepta `id` / `item_id` / `product_id` / `sku` / `name`
  y se resuelve contra `data/coffees.js` (match por id exacto, nombre exacto o parcial).
- **UI → agente**: al hacer click en una tarjeta con la llamada activa se envía
  `view_product` con `{ id, name, price }` para dar contexto al agente.

```jsx
const { onAction, sendAction } = useAgentActions()
useEffect(() => onAction('show_product', payload => { /* resaltar tarjeta */ }), [onAction])
sendAction('view_product', { id, name, price })
```

### Acciones del carrito (`AgentCartBridge.jsx`)

- **agente → UI**: `add_to_cart` (payload flexible + `qty`/`quantity`), `remove_from_cart`, `clear_cart`,
  `order_created` (`{ order_number, total }` — vacía el carrito y muestra `OrderToast`)
- **UI → agente**: `cart_updated` — snapshot `{ items: [{id,bc_item_no,name,qty,price}], total }` en cada
  cambio del carrito con la llamada activa (y al reconectar); `checkout_cart` — mismo shape,
  se envía desde el drawer para que Cafelito cree el pedido en BC (`create-sales-order` con `bc_item_no`)
- Sin llamada activa, el botón de checkout del drawer abre el widget de voz
- El system prompt del agente que gobierna todo esto está versionado en `docs/cafelito-agent-prompt.md`
  (pegarlo en el dashboard con `/vocal-bridge:prompt`)

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
### Herramientas BC MCP (servidor ATICO)

Servidor: `https://patient-intuition-production.up.railway.app/mcp`
Inventario **verificado en vivo** contra el servidor y confirmado en el dashboard
del agente — 12 tools, ninguna más (en el dashboard aparecen prefijadas, `mcp-tools…`):

| Tool | Tipo | Uso en Cafelito |
|---|---|---|
| `get-items` | lectura | Catálogo (default prefijo `W`); filtros por prefijo y descripción |
| `get-item` | lectura | Detalle de un item por número (ej. `WRB-1000`) |
| `get-customers` / `get-customer` | lectura | Identificar al cliente antes del pedido ⚠️ devuelve balances |
| `get-sales-orders` / `get-sales-order` | lectura | Pedidos anteriores y verificación tras crear uno |
| `get-currencies` / `get-payment-terms` | lectura | Maestros para la cabecera del pedido |
| `create-sales-order` | **escritura** | Crea el pedido con sus líneas (`item_number` = `bcItemNo`) |
| `add-sales-order-line` | **escritura** | Añadir línea a un pedido existente |
| `delete-sales-order-line` | **escritura** | Quitar línea por número de secuencia |
| `view-sales-order-builder` | UI | Asistente **visual** — no apto para voz, no debe usarlo el agente |

> Las tools de facturas, incidencias, pagos, entregas y aged receivables que figuraban
> aquí antes **no existen** en este servidor. Si algún día se añaden, actualizar esta
> tabla y `docs/cafelito-agent-prompt.md` a la vez.
>
> Cafelito tiene asignadas las 12, `view-sales-order-builder` incluida: por eso el
> prompt de `docs/cafelito-agent-prompt.md` la prohíbe de forma explícita.

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
Cada café incluye además `bcItemNo` (número de item real en Business Central — ej.
`WRB-COL` → `WRB-1000`), `region` / `altitude` / `process` / `description` (modal de detalle)
y el helper `resolveCoffee(payload)` para el matching flexible (id, bcItemNo o nombre).
El stock estático es solo fallback: `CatalogContext` lo sustituye por el real de BC
consultando `GET /api/catalog` del backend. Los precios son siempre los de la web
(los de BC tienen unidades pendientes de corregir — ver `docs/cafelito-agent-prompt.md`).

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
- [x] `useAgentActions` — acción `show_product` resalta tarjeta en catálogo + `view_product` al agente
- [ ] `useAIAgent` — conectar Cafelito con lógica custom si se necesita
- [x] Carrito de compra — CartContext + drawer + checkout por voz (`checkout_cart` → BC `create-sales-order`)
- [x] Página de producto individual — modal `ProductDetail` con detalle expandido
- [ ] Adaptación Flutter (Android) — misma lógica, LiveKit Flutter SDK
- [ ] Deploy: Vercel (frontend) + Railway/Render (backend)

---

## Convenciones

- CSS Modules para todo — nunca estilos inline salvo layout puntual en JSX
- Variables CSS del tema, nunca colores hardcoded
- Componentes funcionales + hooks — sin clases
- Animaciones definidas en `index.css` como `@keyframes` globales, referenciadas desde módulos
- Tipografía: Playfair Display para títulos, Lora para cuerpo, JetBrains Mono para datos/código
