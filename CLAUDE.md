# CLAUDE.md — RestFood Frontend

Guía para Claude Code al trabajar en este repo. Contexto general en `README.md` y `ARCHITECTURE.md` — leerlos primero.

## Stack
- React 19 + Vite, Tailwind CSS 4, shadcn/Base UI
- Axios (REST), STOMP/SockJS (WebSocket), react-router-dom 7
- Corre en tablets Android (Fully Kiosk) y en la pantalla admin (1080×1920 portrait)

## Comandos
```bash
npm run dev       # desarrollo
npm run lint      # linter — SIEMPRE antes de abrir PR
npm run build     # compila a dist/ — NO publica nada, es carpeta de trabajo
```

## Deploy
```bash
./deploy/deploy-frontend.sh     # main + CI verde -> release versionada + symlink current
./deploy/rollback-frontend.sh   # vuelve a la release anterior
```
Caddy sirve `~/deploys/restfood-frontend/current`, no el `dist/` del repo. Antes
de 2026-07-28 sí servía el `dist/`, y por eso un `npm run build` de prueba
publicaba en producción.

## Flujo de trabajo (obligatorio)
1. Nunca commitear directo a `main`.
2. Crear rama: `feat/<descripcion>` o `fix/<descripcion>`.
3. Commits pequeños, en español, formato conventional: `feat: ...`, `fix: ...`.
4. **Sin atribución de Claude en los commits** (sin Co-Authored-By).
5. `npm run lint` y `npm run build` deben pasar antes del PR.
6. PR a `main` → revisión → merge.

## Reglas del proyecto
- Sistema EN PRODUCCIÓN en un restaurante real. No desplegar sin aprobación de David.
- Probar la UI pensando en tablet (touch, portrait) — no solo en desktop.
- Explicar a David el porqué de cada práctica nueva; las explicaciones largas van al handbook (`~/restfood-handbook/`).
