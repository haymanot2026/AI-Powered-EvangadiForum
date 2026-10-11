
// Backend API base URL.
// Vite reads VITE_API_BASE_URL at build time.
const configuredApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ai-powered-evangadiforum-11.onrender.com/api";

function normalizeApiBaseUrl(value) {
  let url = String(value || "").trim().replace(/\/+$/, "");

  if (!url) {
    url = "https://ai-powered-evangadiforum-11.onrender.com/api";
  }

  if (!/\/api$/i.test(url)) {
    url = `${url}/api`;
  }

  return url;
}

export const API_BASE_URL = normalizeApiBaseUrl(configuredApiUrl);

// Backend origin, used for links such as profile image URLs.
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, "");
