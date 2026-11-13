# OUDORA

E-commerce de perfumería árabe y de diseñador. Sitio público estático + panel de administración, con cierre de compra por WhatsApp.

- **Producción:** https://oudora-teal.vercel.app
- **Panel admin:** https://oudora-teal.vercel.app/admin

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Astro 5 (sitio estático + páginas SSR para admin y API) |
| Lenguaje | TypeScript (modo strict) |
| Base de datos y archivos | Supabase (Postgres + Storage + Auth) |
| Hosting | Vercel |
| Tests | Vitest |
| Package manager | pnpm 10 |
| Node | 22.x |

---

## Puesta en marcha local

1. Instalá Node 22 y pnpm 10.
2. Cloná el repo e instalá dependencias:
   ```bash
   pnpm install
   ```
3. Creá un archivo `.env` en la raíz (te lo pasan por privado, **nunca se sube al repo**):
   ```
   SUPABASE_URL=...
   SUPABASE_KEY=...
   ```
4. Traé el catálogo desde Supabase y levantá el sitio:
   ```bash
   pnpm run sync
   pnpm run dev
   ```
5. Abrí http://localhost:4321

---

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm run dev` | Servidor de desarrollo |
| `pnpm run sync` | Baja productos, marcas, reseñas, etc. de Supabase y regenera `src/data/catalog.generated.ts` |
| `pnpm run build` | Build de producción (corre `sync` antes, automáticamente) |
| `pnpm test` | Corre los tests una vez |
| `pnpm run test:watch` | Tests en modo watch mientras programás |
| `pnpm exec astro check` | Chequeo de tipos de todo el proyecto |

---

## Cómo funciona el catálogo

```
Panel admin  →  Supabase  →  pnpm run sync  →  catalog.generated.ts  →  sitio público
```

- **La fuente de verdad es Supabase.** Productos, precios, stock, marcas y reseñas se cargan desde el panel admin, no desde el código.
- El sitio público **no consulta Supabase** en cada visita: lee un archivo estático generado en el build. Por eso es rápido y no expone la base al navegador.
- Cada deploy en Vercel corre `sync` solo, así que los cambios del admin aparecen en el sitio en el próximo deploy.
- `catalog.generated.ts` **nunca se edita a mano.** Si queda viejo, se regenera con `pnpm run sync`.

> **Regla práctica:** si querés cambiar un precio, un producto o una reseña, usá el **panel admin**. El código se toca solo para cambiar cómo se ve o cómo funciona el sitio.

---

## Estructura del proyecto

```
src/
├── components/      Componentes Astro (públicos y admin/)
├── constants/       Constantes (ui.ts: contacto y analytics · legal.ts · checkout.ts)
├── data/            Datos del catálogo (catalog.generated.ts es generado, no tocar)
├── layouts/         Layout público y AdminLayout
├── lib/             Lógica pura: carrito, filtros, validaciones, formato, WhatsApp
│   └── __tests__/   Tests de Vitest
├── pages/           Rutas del sitio, admin/ y api/
├── scripts/         Controladores de JS que corren en el navegador
├── styles/          tokens.css (design system) y global.css
└── middleware.ts    Protección de /admin y /api/admin
scripts/
└── sync-catalog.mjs Sincronización Supabase → catalog.generated.ts
```

---

## Flujo de trabajo: todo cambio entra por Pull Request

**Nadie hace push directo a `main`.** `main` es producción: cada push publica el sitio.

1. Actualizá tu copia:
   ```bash
   git checkout main
   git pull
   ```
2. Creá una rama con un nombre que describa el cambio:
   ```bash
   git checkout -b feat/banner-dia-de-la-madre
   ```
   Prefijos: `feat/` (algo nuevo) · `fix/` (arreglo) · `style/` (solo visual) · `content/` (textos) · `chore/` (mantenimiento)
3. Hacé los cambios y verificá (ver checklist abajo).
4. Commiteá y subí la rama:
   ```bash
   git add <archivos>
   git commit -m "feat(home): agregar banner del Día de la Madre"
   git push -u origin feat/banner-dia-de-la-madre
   ```
5. En GitHub, abrí un **Pull Request** hacia `main` y completá la plantilla.
6. Vercel genera un **link de preview** en el PR para ver el cambio funcionando antes de publicarlo.
7. El desarrollador revisa. Si hay correcciones, se hacen **en la misma rama** (el PR se actualiza solo).
8. Cuando se aprueba, se mergea y Vercel publica en producción.

### Mensajes de commit

Formato: `tipo(área): descripción en presente`

```
feat(catalogo): agregar filtro por familia olfativa
fix(carrito): corregir total con productos sin stock
style(home): achicar el espacio entre secciones
content(nosotros): actualizar texto de la historia
```

Un commit = un cambio con sentido. No mezcles cosas que no tienen que ver entre sí.

---

## Checklist antes de abrir un PR

- [ ] `pnpm exec astro check` → 0 errores
- [ ] `pnpm test` → todos en verde
- [ ] Probé el cambio en el navegador, en desktop **y** en mobile
- [ ] El PR hace **una sola cosa**
- [ ] No incluí `.env` ni `catalog.generated.ts`
- [ ] No toqué archivos que no tienen que ver con el cambio

---

## Reglas que no se rompen

| Regla | Por qué |
|---|---|
| No subir `.env` ni claves | Son credenciales de la base de datos |
| No editar `catalog.generated.ts` a mano | Se regenera desde Supabase y se pisa |
| No modificar `src/constants/ui.ts` sin avisar | Tiene el WhatsApp, las redes y el ID de Google Tag Manager en vivo |
| No cambiar tablas de Supabase (SQL) por tu cuenta | Un cambio de esquema puede romper el admin y el sitio. Se coordina con el desarrollador |
| No guardar datos del checkout en Supabase | Hoy el sitio **no guarda** datos de clientes, y así lo dicen los textos legales. Guardarlos tiene implicancias legales (Ley 25.326) |
| No cargar scripts de tracking fuera de Google Tag Manager | Los píxeles se configuran en GTM y solo cargan si el usuario acepta cookies |
| No cambiar textos de `/privacidad`, `/terminos` o `/cookies` sin revisión | Son documentos legales |

---

## Analytics

- Todo el tracking (Meta Pixel, Google Analytics, etc.) se administra desde **Google Tag Manager** (`GTM-MWBFTCSR`), sin tocar código.
- GTM **solo carga si el visitante acepta cookies** en el banner. Si rechaza, no se carga nada.
- El sitio empuja al `dataLayer` los eventos `add_to_cart` y `begin_checkout`, listos para conectarlos en GTM.

---

## Deploy

- Push o merge a `main` → Vercel publica en producción.
- Cada Pull Request → Vercel genera un preview con su propio link.
- Las variables de entorno de producción se configuran en Vercel, no en el repo.

---

## Trabajar con Claude Code

El archivo `CLAUDE.md` tiene las reglas del proyecto y Claude Code lo lee automáticamente. Antes de pedirle algo:

- Pedile **una cosa por vez** y bien concreta ("achicá el título del hero en mobile", no "mejorá el home").
- Pedile que trabaje en una **rama nueva** y que abra el PR al final.
- Pedile que corra `astro check` y `pnpm test` antes de terminar.
- Revisá el preview de Vercel antes de pedir la aprobación.

---

## Problemas comunes

| Problema | Solución |
|---|---|
| `pnpm run build` falla en Windows con `EPERM ... symlink` | Es una limitación de Windows, no del proyecto. En Vercel funciona. Para probar localmente usá `pnpm run dev` |
| Git avisa `LF will be replaced by CRLF` | Normal en Windows, no afecta nada |
| Un producto cargado en el admin no aparece | Corré `pnpm run sync` (local) o esperá el próximo deploy |
| No puedo entrar a `/admin` | Las cuentas se crean en Supabase Auth; pedíselo al desarrollador |
