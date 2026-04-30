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

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "RELA — Ropa que habla por ti",
    description: "Tienda de ropa minimalista hecha en Colombia.",
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
        <AuthProvider>
          <CartProvider>
            <FlyToCartProvider>
              <ToastProvider>
                <Navbar />
                <CartDrawer />
                {children}
                <Footer />
                <BottomBar />
              </ToastProvider>
            </FlyToCartProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
