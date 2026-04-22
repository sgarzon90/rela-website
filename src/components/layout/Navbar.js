"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  // Obtenemos el usuario actual y la función de logout
  const { user, signOut } = useAuth()

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

        {/* Acciones del lado derecho */}
        <div className="flex items-center gap-4">

          {/* Si hay usuario logueado mostramos su nombre y botón de logout */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.user_metadata?.nombre || user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-gray-400 hover:text-black transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            // Si no hay usuario mostramos el link de login
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Iniciar sesión
            </Link>
          )}

          {/* Botón del carrito */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            🛒
            {totalItems > 0 && <span>({totalItems})</span>}
          </button>

        </div>
      </div>
    </nav>
  )
}