import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

// Carga el script de gtag.js. `send_page_view: false` porque las vistas de
// página se disparan a mano en GoogleAnalyticsPageview.js — necesario en
// Next.js App Router, donde navegar entre páginas no recarga el documento
// (el registro automático de GA solo vería la primera página de cada visita).
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

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
