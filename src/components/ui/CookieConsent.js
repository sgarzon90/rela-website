"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const elegir = (valor) => {
    setConsent(valor);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-16 md:bottom-0 z-[60] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-4 md:px-6"
      role="region"
      aria-label="Aviso de cookies"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-xs text-gray-600 leading-relaxed text-center sm:text-left flex-1">
          Usamos cookies propias y de análisis (Google Analytics) para entender cómo usas el
          sitio y mejorar tu experiencia. Puedes aceptarlas o seguir navegando solo con las
          esenciales.{" "}
          <Link href="/privacy" className="underline underline-offset-2 text-gray-900 hover:text-black">
            Política de privacidad
          </Link>
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => elegir("rejected")}
            className="px-4 py-2 text-xs font-semibold border border-gray-300 text-gray-700 hover:border-black transition-colors whitespace-nowrap"
          >
            Solo esenciales
          </button>
          <button
            type="button"
            onClick={() => elegir("accepted")}
            className="px-4 py-2 text-xs font-semibold bg-black text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
