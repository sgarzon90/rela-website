"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/gtag";

// El script de GA4 solo registra la primera vista de página al cargar
// (send_page_view: false en el layout, ver GoogleAnalytics.js). En Next.js
// App Router las navegaciones entre páginas no recargan el documento, así
// que sin esto GA4 solo vería una sola vista de página por visita, sin
// importar cuántas páginas recorra alguien.
export default function GoogleAnalyticsPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    pageview(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
