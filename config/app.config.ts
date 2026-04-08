const RAW_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://192.168.7.12:4000/api";

const normalizeUrl = (value: string) => value.replace(/\/+$/, "");

const normalizedEndpoint = normalizeUrl(RAW_ENDPOINT);
const hasApiSuffix = /\/api$/i.test(normalizedEndpoint);

// server base url (without /api)
export const URL = hasApiSuffix
  ? normalizedEndpoint.replace(/\/api$/i, "")
  : normalizedEndpoint;

// api base url (always ends with /api)
export const API_URL = hasApiSuffix ? normalizedEndpoint : `${normalizedEndpoint}/api`;
// app config
export const AppConfig = () => ({
  app: {
    // server endpoint
    url: URL,
    name: "app",
    slogan: "app",
    meta: {
      description: "app",
      keywords: "app",
    },

    // api endpoint
    apiUrl: API_URL,
  },
});
