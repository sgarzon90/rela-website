"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function BottomBar() {
  const pathname = usePathname()
  const { totalItems, setIsOpen } = useCart()
  const { user, perfil } = useAuth()

  // No mostrar el bottom bar en páginas de admin o auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null

  const isAdmin = perfil?.rol === "admin"

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
      {/* Si es admin mostramos 5 iconos, si no 4 */}
      <div className={`grid h-16 ${isAdmin ? "grid-cols-5" : "grid-cols-4"}`}>

        {/* Inicio */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname === "/" ? "text-black" : "text-gray-400 hover:text-black"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>

        {/* Productos */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname === "/products" ? "text-black" : "text-gray-400 hover:text-black"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <span className="text-[10px] font-medium">Productos</span>
        </Link>

        {/* Carrito */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-black transition-colors relative"
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Carrito</span>
        </button>

        {/* Cuenta */}
        <Link
          href={user ? "/account/orders" : "/auth/login"}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname.startsWith("/account") ? "text-black" : "text-gray-400 hover:text-black"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="text-[10px] font-medium">{user ? "Cuenta" : "Entrar"}</span>
        </Link>

        {/* Admin — solo visible para admins */}
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname.startsWith("/admin") ? "text-black" : "text-gray-400 hover:text-black"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}

      </div>
    </nav>
  )
}