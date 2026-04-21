import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "RELA - Tienda de Ropa",
  description: "Descubre nuestra colección",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}