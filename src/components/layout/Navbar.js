"use client"

import Link from "next/link"
// Importamos el hook del carrito para mostrar el contador
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  // Obtenemos el total de items y la función para abrir el carrito
  const { totalItems, setIsOpen } = useCart()

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-widest text-black">
          RELA
        </Link>

        {/* Links del menú */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
            Inicio
          </Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-black transition-colors">
            Productos
          </Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
            Nosotros
          </Link>
        </div>

        {/* Botón del carrito — muestra el número de items */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
        >
          🛒
          {/* Solo muestra el número si hay items en el carrito */}
          <span>Carrito {totalItems > 0 && `(${totalItems})`}</span>
        </button>

      </div>
    </nav>
  )
}