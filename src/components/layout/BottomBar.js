"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useFlyToCart } from "@/context/FlyToCartContext"

export default function BottomBar() {
  const pathname = usePathname()
  const { totalItems, setIsOpen } = useCart()
  const { user, perfil } = useAuth()
  const { cartBottomRef, cartBounce } = useFlyToCart()

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null

  const isAdmin = perfil?.rol === "admin"
  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]">

        {/* Inicio */}
        <Link href="/" className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive("/") ? "text-black" : "text-gray-400"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive("/") ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          <span className="text-[10px] font-medium">Inicio</span>
          {isActive("/") && <span className="w-1 h-1 rounded-full bg-black" />}
        </Link>

        {/* Productos */}
        <Link href="/products" className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive("/products") ? "text-black" : "text-gray-400"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive("/products") ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <span className="text-[10px] font-medium">Productos</span>
          {isActive("/products") && <span className="w-1 h-1 rounded-full bg-black" />}
        </Link>

        {/* Carrito — botón central destacado */}
        <button
          ref={cartBottomRef}
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 px-4 py-1.5"
          aria-label="Abrir carrito"
        >
          <div className={`relative w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95 ${cartBounce ? "animate-cart-pop" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {totalItems > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black transition-transform ${cartBounce ? "scale-125" : "scale-100"}`}>
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-gray-400">Carrito</span>
        </button>

        {/* Cuenta */}
        <Link href={user ? "/account/orders" : "/auth/login"} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive("/account") ? "text-black" : "text-gray-400"}`}>
          {user ? (
            <div className="w-[22px] h-[22px] rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold uppercase">
              {(user.user_metadata?.nombre || user.email || "U")[0]}
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          )}
          <span className="text-[10px] font-medium">{user ? "Cuenta" : "Entrar"}</span>
          {isActive("/account") && <span className="w-1 h-1 rounded-full bg-black" />}
        </Link>

        {/* Admin — solo visible para admins */}
        {isAdmin && (
          <Link href="/admin" className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive("/admin") ? "text-black" : "text-gray-400"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}

      </div>
    </nav>
  )
}
