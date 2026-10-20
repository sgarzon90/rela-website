// Estado de consentimiento de cookies, guardado en localStorage.
// "accepted" | "rejected" | null (null = todavía no ha decidido)
export const CONSENT_KEY = "rela-cookie-consent";
export const CONSENT_EVENT = "rela-consent-change";

export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage puede fallar en navegación privada — no es crítico aquí,
    // simplemente el banner volverá a aparecer en la próxima visita.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
