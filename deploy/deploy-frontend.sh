#!/usr/bin/env bash
# Deploy del frontend RestFood — el equivalente del deploy/deploy.sh del backend.
#
# POR QUÉ EXISTE:
#
# Hasta el 2026-07-28 no había despliegue del frontend: `npm run build` escribía
# directo en /home/david/RestFoodF/dist, que era EXACTAMENTE la carpeta que Caddy
# servía en producción. Compilar y publicar eran el mismo acto, así que:
#   - probar un build tiraba a producción lo que hubiera en el árbol de trabajo,
#   - no había forma de volver a la versión anterior: la anterior ya no existía,
#   - un build a medias dejaba el dist a medias, en vivo.
# Costó dos incidentes el 2026-07-27 (uno de ellos publicó un frontend apuntando
# a staging, porque Vite carga .env.local también en builds de producción).
#
# Ahora Caddy sirve /home/david/deploys/restfood-frontend/current, un symlink a
# una release con fecha y sha. Publicar es mover el symlink: es atómico, y el
# `dist/` del repo vuelve a ser lo que siempre debió ser — una carpeta de trabajo
# que no le importa a nadie.
#
# Uso:  ./deploy/deploy-frontend.sh
set -euo pipefail

REPO_DIR="$HOME/RestFoodF"
DEPLOY_DIR="$HOME/deploys/restfood-frontend"
RELEASES_DIR="$DEPLOY_DIR/releases"
URL_VERIFICACION="https://192.168.10.100/"
KEEP_RELEASES=5

log() { echo "[deploy-front] $*"; }
die() { echo "[deploy-front] ERROR: $*" >&2; exit 1; }

# 1. Solo se despliega main, limpio y actualizado
cd "$REPO_DIR"
[[ "$(git rev-parse --abbrev-ref HEAD)" == "main" ]] || die "hay que estar en main (estás en $(git rev-parse --abbrev-ref HEAD))"
[[ -z "$(git status --porcelain)" ]] || die "hay cambios sin commitear; el deploy solo usa código versionado"
git pull --ff-only
SHA="$(git rev-parse --short HEAD)"

# 2. Solo se despliega lo que el CI ya aprobó
ESTADO_CI="$(gh api "repos/davidpp09/RestFoodF/commits/$SHA/check-runs" \
    --jq '[.check_runs[] | select(.name=="tests")][0].conclusion' 2>/dev/null || echo desconocido)"
[[ "$ESTADO_CI" == "success" ]] || die "el check 'tests' del commit $SHA no está en verde (estado: $ESTADO_CI)"

# 3. Construir
#
# Ojo con .env.local: Vite lo carga TAMBIÉN en producción (solo se salta los
# .env.*.local del modo contrario). Un archivo olvidado apuntando a staging
# viaja dentro del bundle sin que nada avise. Por eso se aborta si existe.
[[ -e "$REPO_DIR/.env.local" ]] && die ".env.local existe y Vite lo carga en producción — renómbralo antes de desplegar"

log "construyendo $SHA (build limpio)..."
rm -rf "$REPO_DIR/dist"
npm ci --silent
npm run build

[[ -f "$REPO_DIR/dist/index.html" ]] || die "el build no generó dist/index.html"

# El index.html referencia el bundle por nombre con hash. Si ese archivo no está
# en el dist, la tablet carga un HTML que pide un JS inexistente: pantalla en
# blanco sin un solo error en el servidor.
BUNDLE="$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' "$REPO_DIR/dist/index.html" | head -1)"
[[ -n "$BUNDLE" ]] || die "no se encontró la referencia al bundle en index.html"
[[ -f "$REPO_DIR/dist/$BUNDLE" ]] || die "index.html pide $BUNDLE y ese archivo no está en dist/"
log "bundle del build: $BUNDLE"

# 4. Guardar la release y apuntar current (previous queda para el rollback)
mkdir -p "$RELEASES_DIR"
RELEASE="$RELEASES_DIR/$(date +%Y%m%d-%H%M%S)-$SHA"
cp -r "$REPO_DIR/dist" "$RELEASE"

if [[ -e "$DEPLOY_DIR/current" ]]; then
    ln -sfn "$(readlink -f "$DEPLOY_DIR/current")" "$DEPLOY_DIR/previous"
fi
# `ln -sfn` sobre el symlink es lo más cerca de atómico que hay aquí: ninguna
# petición ve un estado intermedio, y no hace falta recargar Caddy — la ruta se
# resuelve en cada petición.
ln -sfn "$RELEASE" "$DEPLOY_DIR/current"

# 5. Verificar contra el servidor real, no contra el disco
CODIGO="$(curl -s -k -o /dev/null -w '%{http_code}' -m 10 "$URL_VERIFICACION" || true)"
SERVIDO="$(curl -s -k -m 10 "$URL_VERIFICACION" | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' | head -1 || true)"
if [[ "$CODIGO" != "200" || "$SERVIDO" != "$BUNDLE" ]]; then
    log "la verificación falló (HTTP $CODIGO, sirviendo '$SERVIDO', se esperaba '$BUNDLE') — ROLLBACK automático"
    if [[ -e "$DEPLOY_DIR/previous" ]]; then
        ln -sfn "$(readlink -f "$DEPLOY_DIR/previous")" "$DEPLOY_DIR/current"
    fi
    die "deploy fallido; se restauró la versión anterior"
fi

# 6. Conservar solo las últimas $KEEP_RELEASES (nunca la actual ni la anterior)
ls -dt "$RELEASES_DIR"/*/ 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) | while read -r vieja; do
    vieja="${vieja%/}"
    [[ "$vieja" == "$(readlink -f "$DEPLOY_DIR/current")" ]] && continue
    [[ -e "$DEPLOY_DIR/previous" && "$vieja" == "$(readlink -f "$DEPLOY_DIR/previous")" ]] && continue
    rm -rf "$vieja"
done

log "desplegado $SHA → $(basename "$RELEASE") (HTTP $CODIGO, sirviendo $BUNDLE)"
log "las tablets toman el cambio con una recarga; el index.html se sirve con no-cache."
