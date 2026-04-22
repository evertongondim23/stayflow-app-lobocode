# Convenção de portas – Frontend (StayFlow)

Na VPS, os três produtos seguem o mesmo sufixo em cada faixa: **API 30x0**, **frontend 31x0**, **Postgres 32x0** (e serviços auxiliares com o mesmo sufixo quando existir backend).

| Slot VPS | API (30xx) | Frontend (31xx) | Postgres (32xx) |
|----------|------------|-----------------|-----------------|
| 1º (ex.: Time da Sorte) | 3000 | 3100 | 3200 |
| 2º | 3010 | 3110 | 3210 |
| **3º – StayFlow** | **3020** | **3120** | **3220** |

Outras bases de documentação:

- Time da Sorte — `Timedasorteapp/docs/PORTAS-PADRAO.md`
- DER (bloco *11 em desenvolvimento local) — `der-api-lobocode/docs/PORTAS-PADRAO.md`

**StayFlow (3º slot, sufixo 20):**

- **Backend/API (local)**: `http://localhost:3020` — `VITE_API_URL` no `.env`
- **Frontend (Vite dev e Docker host)**: `http://localhost:3120` — `vite.config.ts` (`server.port: 3120`)

## Variáveis de ambiente

No `.env` do frontend:

```env
VITE_API_URL=http://localhost:3020
```

Em produção, use a URL pública da API (ex.: `https://stayflow-api.lobocode.com.br`).

## Docker (produção)

- **Frontend em container**: porta do host **3120** → 80 (nginx no container)
- Build/deploy: `docker compose -f docker-compose.prod.yml up -d`
- URL local do app: `http://localhost:3120`
- Rede: `app-net-stayflow` (external). Criar com: `docker network create app-net-stayflow`
- Para build com API de produção, defina `VITE_API_URL` no ambiente antes do build.

## Referência de infra completa

Quando existir backend StayFlow com Postgres na porta **3220** (e demais serviços no sufixo **20**), documente a tabela completa nesse repositório (como em `timedasorte-engine/docs/PORTAS-PADRAO.md` para o Time da Sorte).
