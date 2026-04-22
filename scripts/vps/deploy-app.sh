#!/bin/bash
set -euo pipefail

# Frontend na VPS: variáveis no .env da raiz (ver .env.example).

ENV_FILE="${ENV_FILE:-.env}"
if [ -f "${ENV_FILE}" ]; then
  set -a
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  set +a
fi

COMPOSE_FILE="${VPS_APP_COMPOSE_FILE:-docker/docker-compose.vps-app.yml}"
TRAEFIK_NETWORK="${TRAEFIK_NETWORK:-}"
APP_HOST="${APP_HOST:-}"
APP_HOST_EXAMPLE="${APP_HOST_EXAMPLE:-app.exemplo.com}"

if [ -z "${COMPOSE_VPS_STACK_NAME:-}" ]; then
  echo "Defina COMPOSE_VPS_STACK_NAME no ${ENV_FILE}"
  exit 1
fi

if [ -z "${VITE_API_URL:-}" ]; then
  echo "Defina VITE_API_URL no ${ENV_FILE} (URL pública da API, ex.: https://api.exemplo.com)"
  exit 1
fi

echo "Subindo frontend no modo VPS multi-projeto..."

if [ ! -f "${COMPOSE_FILE}" ]; then
  echo "Arquivo ${COMPOSE_FILE} não encontrado."
  exit 1
fi

if [ -z "${APP_HOST}" ]; then
  echo "Defina APP_HOST no ${ENV_FILE}"
  echo "Exemplo: APP_HOST=${APP_HOST_EXAMPLE}"
  exit 1
fi

if [ -z "${TRAEFIK_NETWORK}" ]; then
  echo "Defina TRAEFIK_NETWORK no ${ENV_FILE}"
  exit 1
fi

if ! docker network ls --format '{{.Name}}' | grep -Fxq "${TRAEFIK_NETWORK}"; then
  echo "Rede compartilhada ${TRAEFIK_NETWORK} não existe."
  echo "Suba o Traefik/gateway no repositório da API (ex.: projeto-api: ./scripts/deploy.sh vps-gateway)."
  exit 1
fi

echo "Validando compose da aplicação..."
docker compose -f "${COMPOSE_FILE}" config >/dev/null

echo "Iniciando stack ${COMPOSE_VPS_STACK_NAME}..."
docker compose -p "${COMPOSE_VPS_STACK_NAME}" -f "${COMPOSE_FILE}" up -d --build

echo ""
echo "Stack do frontend iniciada."
echo "Domínio roteado: ${APP_HOST}"
echo "Verifique: docker compose -p ${COMPOSE_VPS_STACK_NAME} -f ${COMPOSE_FILE} ps"
