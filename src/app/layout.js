import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/ui/CartDrawer"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "RELA — Ropa que habla por ti",
    template: "%s | RELA",
  },
  description: "Tienda de ropa minimalista hecha en Colombia. Camisetas, hoodies y pantalones diseñados para quienes no necesitan seguir tendencias.",
  keywords: ["ropa colombia", "ropa minimalista", "hoodies colombia", "camisetas oversize", "moda colombiana"],
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        {/* AuthProvider envuelve todo para que cualquier componente sepa si hay un usuario logueado */}
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}