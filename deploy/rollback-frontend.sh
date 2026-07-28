#!/usr/bin/env bash
# Vuelve el frontend a la release anterior. Uso: ./deploy/rollback-frontend.sh
#
# A diferencia del backend, aquí el rollback SIEMPRE funciona: no hay migraciones
# de por medio, solo archivos estáticos. Es mover un symlink, sin recargar nada.
set -euo pipefail

DEPLOY_DIR="$HOME/deploys/restfood-frontend"
URL_VERIFICACION="https://192.168.10.100/"

log() { echo "[rollback-front] $*"; }
die() { echo "[rollback-front] ERROR: $*" >&2; exit 1; }

[[ -e "$DEPLOY_DIR/previous" ]] || die "no hay release anterior a la que volver"

ACTUAL="$(readlink -f "$DEPLOY_DIR/current")"
ANTERIOR="$(readlink -f "$DEPLOY_DIR/previous")"
[[ "$ACTUAL" != "$ANTERIOR" ]] || die "current y previous apuntan a la misma release"

log "actual:   $(basename "$ACTUAL")"
log "volviendo a: $(basename "$ANTERIOR")"

# Se intercambian: así un segundo rollback deshace el primero.
ln -sfn "$ANTERIOR" "$DEPLOY_DIR/current"
ln -sfn "$ACTUAL"   "$DEPLOY_DIR/previous"

CODIGO="$(curl -s -k -o /dev/null -w '%{http_code}' -m 10 "$URL_VERIFICACION" || true)"
SERVIDO="$(curl -s -k -m 10 "$URL_VERIFICACION" | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' | head -1 || true)"
[[ "$CODIGO" == "200" ]] || die "tras el rollback el sitio responde HTTP $CODIGO — revisar a mano"

log "listo: HTTP $CODIGO, sirviendo $SERVIDO"
log "las tablets que tengan la pantalla abierta necesitan una recarga."
