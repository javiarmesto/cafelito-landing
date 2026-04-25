# Bitácora — cafelito-landing

Registro de cambios y decisiones por sesión, para retomar el trabajo en otra conversación sin perder contexto.

---

## Sesión 2026-04-25

### Estado de partida
- Proyecto funcional: React 18 + Vite, integración real con `@vocalbridgeai/react`.
- Hero con taza emoji ☕ decorativa, fondo oscuro plano, FAB en esquina.
- Backend `cafelito-backend` corriendo en `localhost:3001`.

### Cambios entregados

#### 1. Mapa de orígenes (commit `057fd61`)
- Nuevo componente `src/components/OriginsMap.jsx` + `.module.css`.
- Mapamundi SVG estilizado con continentes blob, lat/long grid sutil.
- Hub en España (Madrid) con pin destacado en cream, líneas curvas dashed animadas hacia 5 orígenes (Colombia, Brasil, Etiopía, Kenia, Hawaii).
- Hover sobre pin muestra nombre + notas de cata.
- Insertado entre `Hero` y `Catalogue` en `App.jsx`.

#### 2. Imagen de fondo en Hero (commit `057fd61`)
- `public/hero-bg.png` (taza, chemex, molinillo, granos).
- Doble gradiente overlay (horizontal + vertical) para mantener legibilidad del texto a la izquierda.
- Animación Ken Burns 24s.
- Eliminada taza emoji decorativa del Hero.

#### 3. Modo claro / oscuro (sin commitear aún)
- Sistema de temas con CSS custom properties.
- `:root[data-theme="dark"]` (default) y `:root[data-theme="light"]`.
- Paleta clara estilo "kraft paper": fondo cream `#F5E6D3`, texto espresso `#2A1507`, oro `#6B4226`.
- Componente `src/components/ThemeToggle.jsx` + `.module.css` con toggle slide ☀/☾ en la nav.
- Persistencia en `localStorage` (`cafelito-theme`), respeta `prefers-color-scheme` la primera vez.
- Filtro suave en imagen del Hero en modo claro para no chocar con la paleta.
- Overlay del Hero más opaco en modo claro para garantizar legibilidad del texto.

#### 4. Widget de voz protagonista en Hero (sin commitear aún)
- Nuevo `src/components/HeroVoiceCard.jsx` + `.module.css`.
- Card glassmorphic en el lado derecho del Hero.
- Botón circular 96px (reducido desde 140px tras feedback) con icono ☕.
- Doble pulso dorado animado.
- Onda de audio idle, etiqueta "Pulsa y cuéntame", hint en primera persona.
- 4 chips de sugerencias clickables: "Algo con cuerpo", "Sin cafeína", "Bajo de 20€", "Frutal y suave".
- Eyebrow: "Hola, soy Cafelito".
- Click en botón o chip abre el modal `VoiceWidget` existente.

#### 5. Limpieza de copy
- Eliminados todos los em-dashes (`—`) y en-dashes (`–`) del UI.
- Memory guardada en `~/.claude/projects/.../memory/feedback_writing_style.md` para futuras sesiones.

### Decisiones de arquitectura
- **Tema dual con CSS vars**: la paleta café se mantiene como acento en ambos modos. Las CoffeeCards conservan su gradiente oscuro propio (intencional: destacan sobre cream en light mode).
- **Imagen de fondo conservada en ambos modos**: en light se atenúa con filtro y overlay cream para no chocar.
- **Widget protagonista pero compacto**: 340px max-width tras feedback de "demasiado protagonismo".
- **FAB se mantiene**: funciona como CTA persistente al hacer scroll fuera del Hero.

### Tareas pendientes / próxima sesión

#### Inmediato
- [ ] Commit y push de los cambios pendientes (theme + HeroVoiceCard + ajustes copy).
- [ ] Probar sesión de voz real con backend arrancado.

#### Responsive (no prioritario según usuario)
- [ ] Audit móvil/tablet: la imagen Hero `background-position: center right` muestra solo zona oscura en móvil; cambiar a `center` en móvil.
- [ ] OriginsMap necesita variante mobile: viewBox 1000×500 deja pines y labels ilegibles. Sustituir por lista vertical bandera+nombre+notas en `< 768px`.
- [ ] Verificar Catalogue grid colapsa a 1 columna `< 600px`.
- [ ] VoiceWidget modal: confirmar que pasa a fullscreen en móvil.
- [ ] Touch targets ≥44px (parece OK pero confirmar).

#### Deploy
- [ ] **Frontend** en Vercel:
  - Conectar repo `javiarmesto/cafelito-landing`.
  - Env var: `VITE_TOKEN_URL=https://cafelito-backend.up.railway.app/api/voice-token` (o dominio final).
  - Build command: `npm run build` (auto-detected).
  - Output: `dist/`.
- [ ] **Backend** en Railway (o Render):
  - Obligatorio HTTPS porque el browser bloquea `getUserMedia` en HTTP no-localhost.
  - Habilitar CORS para el dominio de Vercel.
  - Variables de entorno (las que use el backend para OpenAI/LiveKit/BC MCP).
- [ ] Test obligatorio en móvil real antes de demo (iOS Safari y Chrome Android difieren con WebRTC + permisos micro).

#### Mejoras estéticas / UX (en cola)
- [ ] Modal `VoiceWidget` más inmersivo al expandir (60vw × 70vh, onda audio centro tipo Siri).
- [ ] Esconder FAB cuando el usuario está viendo el Hero (scroll listener).
- [ ] Considerar ritmo de fondos por sección (alternar `--bg`/`--bg2`/`--bg3`) para más jerarquía visual.

### Referencias
- Repo: https://github.com/javiarmesto/cafelito-landing
- Stack y convenciones: ver `CLAUDE.md`.
- Backend (otro repo): `cafelito-backend` en `localhost:3001`.

### Última imagen mental para retomar
> "Hero con texto a la izquierda + voice card compacta a la derecha sobre imagen oscura. Toggle de tema en nav. Mapa de orígenes entre Hero y catálogo. Pendiente: commitear theme+HeroVoiceCard, probar voz real, deploy a Vercel + Railway."
