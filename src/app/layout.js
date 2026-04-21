import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import { CartProvider } from "@/context/CartContext"
import CartDrawer from "@/components/ui/CartDrawer"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "RELA - Tienda de Ropa",
  description: "Descubre nuestra colección",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <CartProvider>
          <Navbar />
          {/* El drawer vive aquí para estar disponible en todas las páginas */}
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}