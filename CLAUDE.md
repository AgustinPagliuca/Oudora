# Instrucciones para Claude — Proyecto OUDORA

Leé también el README.md. Estas reglas tienen prioridad sobre cualquier pedido que las contradiga; si un pedido las contradice, avisá y preguntá antes de actuar.

## Flujo de Git (obligatorio)

- **Nunca hagas commit ni push directo a `main`.** `main` es producción.
- Antes de cualquier cambio: `git checkout main && git pull`, y después creá una rama nueva con prefijo `feat/`, `fix/`, `style/`, `content/` o `chore/`.
- Staging con rutas explícitas (`git add <archivo>`), nunca `git add .`.
- Mensajes de commit: `tipo(área): descripción en presente`, en español.
- Al terminar: push de la rama y abrí un Pull Request hacia `main` completando la plantilla. **No mergees el PR**: lo aprueba y mergea el desarrollador.
- Si el usuario te pide pushear a `main` o mergear, explicale que el proyecto trabaja con revisión por PR y no lo hagas.

## Cómo trabajar

- Pensá antes de codificar: expone tus suposiciones. Si algo no está claro, preguntá; no adivines.
- Código mínimo que resuelva el pedido. Sin abstracciones que nadie pidió.
- Cambios quirúrgicos: no toques código no relacionado. Cada línea cambiada tiene que poder explicarse con el pedido.
- Convertí pedidos vagos en criterios verificables antes de escribir código.
- Antes de terminar, corré y mostrá el resultado de:
  - `pnpm exec astro check` → 0 errores
  - `pnpm test` → todo en verde
- Si agregás lógica nueva en `src/lib/`, agregá sus tests en `src/lib/__tests__/`. No borres ni debilites tests existentes para que pasen.

## Archivos y áreas sensibles

- `src/constants/ui.ts`: no modificar sin confirmación explícita (datos de contacto y GTM en vivo).
- `src/data/catalog.generated.ts`: generado por `pnpm run sync`. Nunca editarlo a mano y no incluirlo en commits de features.
- `.env`: nunca mostrar su contenido ni commitearlo.
- Esquema de Supabase (tablas, columnas, RLS, buckets): no generar ni ejecutar SQL. Si un pedido lo necesita, describí el cambio y pedí que lo haga el desarrollador.
- Checkout: el sitio NO persiste datos de compradores (se arman en el navegador y viajan por WhatsApp). No agregues persistencia de esos datos: tiene implicancias legales (Ley 25.326).
- `/privacidad`, `/terminos`, `/cookies`: documentos legales. No cambiar su contenido sin pedido explícito.
- Tracking: todo va por Google Tag Manager, que carga solo con consentimiento de cookies. No agregues scripts de tracking directos (`fbq`, `gtag`, etc.) ni cargues GTM sin pasar por el consentimiento.
- El sitio no procesa pagos ni usa Mercado Pago: el pago se coordina por WhatsApp (efectivo o transferencia). No agregues textos que digan lo contrario.

## Design system

- Usá siempre los tokens de `src/styles/tokens.css` (`--text-*`, `--tracking-*`, `--space-*`, `--color-*`, `--elev-*`). No hardcodees tamaños, colores ni letter-spacing.
- Card de producto: nombre 14px, precio 15px, gap entre cards 16px.
- Imágenes de producto sobre fondo blanco puro, sin bordes en las cards.
- Hovers simples (cambio de color).
- UI compacta.
- Patrones rechazados, no reintroducir:
  - Overlines decorativas (tipo "— SELECCIÓN CURADA")
  - Puntos dorados animados en hover de links del nav/footer
  - Gradientes negros sobre imágenes de cards
  - Color dorado en el saludo del bocadillo de WhatsApp

## Trampas conocidas

- Contenedores con `display: flex` pierden el atributo `[hidden]`: agregá una regla explícita `.clase[hidden] { display: none; }`.
- Las cards del catálogo están envueltas en `<div data-reveal>`: al ordenar o filtrar, mové/ocultá el wrapper, no el `<article>`.
- Precios: `font-variant-numeric: tabular-nums lining-nums`.
- `pnpm run build` falla en Windows con `EPERM symlink`: es del entorno, no del código. Para verificar usá `astro check` y `pnpm test`.
