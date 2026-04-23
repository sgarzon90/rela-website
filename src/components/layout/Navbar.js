"use client"

import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user, signOut, perfil } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 relative z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-widest text-black">
          RELA
        </Link>

        {/* Links del menú — solo visibles en desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
            Inicio
          </Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-black transition-colors">
            Productos
          </Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
            Nosotros
          </Link>
          {perfil?.rol === "admin" && (
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black transition-colors">
              Admin
            </Link>
          )}
        </div>

        {/* Acciones lado derecho */}
        <div className="flex items-center gap-3">

          {/* Login visible en móvil cuando no hay sesión — fuera del hamburguesa */}
          {!user && (
            <Link
              href="/auth/login"
              className="md:hidden text-sm text-gray-600 hover:text-black transition-colors"
            >
              Entrar
            </Link>
          )}

          {/* Usuario — solo visible en desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/account/orders" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Mis órdenes
                </Link>
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.nombre || user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-400 hover:text-black transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Botón del carrito — visible siempre */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            🛒
            {totalItems > 0 && <span>({totalItems})</span>}
          </button>

          {/* Botón hamburguesa — solo visible en móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuAbierto ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

        </div>
      </div>

      {/* Menú móvil — se despliega cuando está abierto */}
      {menuAbierto && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg px-6 py-6 space-y-4">

          <Link
            href="/"
            onClick={() => setMenuAbierto(false)}
            className="block text-sm text-gray-600 hover:text-black transition-colors py-2 border-b border-gray-50"
          >
            Inicio
          </Link>
          <Link
            href="/products"
            onClick={() => setMenuAbierto(false)}
            className="block text-sm text-gray-600 hover:text-black transition-colors py-2 border-b border-gray-50"
          >
            Productos
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuAbierto(false)}
            className="block text-sm text-gray-600 hover:text-black transition-colors py-2 border-b border-gray-50"
          >
            Nosotros
          </Link>

          {/* Links de usuario en móvil — solo si está logueado */}
          {user && (
            <>
              <Link
                href="/account/orders"
                onClick={() => setMenuAbierto(false)}
                className="block text-sm text-gray-600 hover:text-black transition-colors py-2 border-b border-gray-50"
              >
                Mis órdenes
              </Link>
              {perfil?.rol === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuAbierto(false)}
                  className="block text-sm text-gray-600 hover:text-black transition-colors py-2 border-b border-gray-50"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.nombre || user.email}
                </span>
                <button
                  onClick={() => { signOut(); setMenuAbierto(false) }}
                  className="text-sm text-gray-400 hover:text-black transition-colors"
                >
                  Salir
                </button>
              </div>
            </>
          )}

        </div>
      )}
    </nav>
  )
}