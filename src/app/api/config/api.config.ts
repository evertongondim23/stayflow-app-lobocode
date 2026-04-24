type ImportMetaEnvLike = {
  VITE_API_URL?: string;
  PROD?: boolean;
};

const env = (import.meta as ImportMeta & { env?: ImportMetaEnvLike }).env;
const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

export const API_BASE_URL =
  env?.VITE_API_URL && env.VITE_API_URL.trim().length > 0
    ? normalizeUrl(env.VITE_API_URL)
    : env?.PROD
      ? "https://stayflow-api.lobocode.com.br"
      : "http://localhost:3000";
