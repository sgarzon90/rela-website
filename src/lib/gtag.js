// Helpers para Google Analytics 4 (gtag.js). El script en sí se carga una
// sola vez desde el layout raíz; estas funciones solo empujan datos al
// `dataLayer` que ese script ya está escuchando.
//
// Todas son no-ops seguros si GA aún no cargó (por ejemplo, en el primer
// instante antes de que el script async termine de ejecutarse) o si no hay
// ID de medición configurado (desarrollo local sin la variable de entorno).
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function pageview(url) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

export function event(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
