"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import { getConsent, CONSENT_EVENT } from "@/lib/cookie-consent";

// Carga el script de gtag.js solo si la persona aceptó el aviso de cookies.
// `send_page_view: false` porque las vistas de página se disparan a mano en
// GoogleAnalyticsPageview.js — necesario en Next.js App Router, donde
// navegar entre páginas no recarga el documento.
export default function GoogleAnalytics() {
  const [habilitado, setHabilitado] = useState(false);

  useEffect(() => {
    setHabilitado(getConsent() === "accepted");

    const onChange = (e) => setHabilitado(e.detail === "accepted");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!GA_MEASUREMENT_ID || !habilitado) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
