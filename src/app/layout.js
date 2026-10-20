import { Suspense } from "react";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import BottomBar from "@/components/layout/BottomBar";
import { FlyToCartProvider } from "@/context/FlyToCartContext";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GoogleAnalyticsPageview from "@/components/analytics/GoogleAnalyticsPageview";
import CookieConsent from "@/components/ui/CookieConsent";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "RELA — Ropa que habla por ti",
    template: "%s | RELA",
  },
  description:
    "Tienda de ropa minimalista hecha en Colombia. Camisetas, hoodies y pantalones diseñados para quienes no necesitan seguir tendencias.",
  keywords: [
    "ropa colombia",
    "ropa minimalista",
    "hoodies colombia",
    "camisetas oversize",
    "moda colombiana",
  ],
  authors: [{ name: "RELA" }],
  creator: "RELA",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "RELA",
    title: "RELA — Ropa que habla por ti",
    description: "Tienda de ropa minimalista hecha en Colombia.",
    // Imagen de respaldo para páginas que no definen la suya propia (las de
    // producto sí tienen su propia foto) — antes no había ninguna, así que
    // compartir el inicio, Nosotros, etc. no mostraba ninguna vista previa.
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RELA — Ropa que habla por ti",
    description: "Tienda de ropa minimalista hecha en Colombia.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${playfair.variable} font-sans`}>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <GoogleAnalyticsPageview />
        </Suspense>
        <AuthProvider>
          <CartProvider>
            <FlyToCartProvider>
              <ToastProvider>
                <Navbar />
                <CartDrawer />
                {children}
                <Footer />
                <BottomBar />
                <WhatsAppButton />
                <CookieConsent />
                <Analytics />
                <SpeedInsights />
              </ToastProvider>
            </FlyToCartProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
