#!/bin/bash
set -euo pipefail

# Deploy do front na VPS: docker-compose.vps-app.yml + .env na raiz.
# Traefik (gateway) roda no repositório da API/infra.

ENV_FILE="${ENV_FILE:-.env}"
if [ -f "${ENV_FILE}" ]; then
  set -a
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  set +a
fi

show_help() {
  local example_project="${VPS_APP_PROJECT_NAME:-<VPS_APP_PROJECT_NAME>}"
  local example_host="${APP_HOST:-<APP_HOST>}"
  echo "Deploy frontend (docker/docker-compose.vps-app.yml)"
  echo ""
  echo "Uso: ./scripts/deploy.sh [comando]"
  echo ""
  echo "Comandos:"
  echo "  vps-app  - Build + container Nginx com labels Traefik"
  echo "  help"
  echo ""
  echo "Antes: Traefik na VPS (ex.: no projeto-api)."
  echo "No .env: VITE_API_URL, APP_HOST, TRAEFIK_NETWORK, … — veja .env.example."
  echo ""
  echo "Exemplo:"
  echo "  ./scripts/deploy.sh vps-app"
  echo "  VPS_APP_PROJECT_NAME=${example_project} APP_HOST=${example_host} ./scripts/deploy.sh vps-app"
}

check_directory() {
  if [ ! -f "docker/docker-compose.vps-app.yml" ]; then
    echo "Erro: execute na raiz do repositório (pasta que contém docker/)."
    exit 1
  fi
}

check_directory

case "${1:-help}" in
  vps-app)
    if [ ! -f "${ENV_FILE}" ]; then
      echo "Crie o ${ENV_FILE} (ex.: cp .env.example .env) e preencha VITE_API_URL, APP_HOST, etc."
      exit 1
    fi
    if [ -z "${VITE_API_URL:-}" ]; then
      echo "Defina VITE_API_URL no ${ENV_FILE} (URL pública da API)."
      exit 1
    fi
    ./scripts/vps/deploy-app.sh
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo "Comando inválido: ${1:-}"
    echo ""
    show_help
    exit 1
    ;;
esac
