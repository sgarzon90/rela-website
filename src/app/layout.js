import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/ui/CartDrawer"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "RELA - Tienda de Ropa",
  description: "Descubre nuestra colección",
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