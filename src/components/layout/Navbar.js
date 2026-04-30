"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFlyToCart } from "@/context/FlyToCartContext";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { user, signOut, perfil, loadingPerfil } = useAuth();
  const { cartIconRef, cartBounce } = useFlyToCart();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos" },
    { href: "/about", label: "Nosotros" },
  ];

  return (
    <>
      <nav
        className={`bg-white px-6 py-2 relative z-30 transition-shadow duration-300 ${
          scrolled
            ? "shadow-md border-b border-gray-100"
            : "border-b border-gray-100"
        }`}
      >
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0"
            onClick={() => setMenuAbierto(false)}
          >
            <img
              src="/Logo3.png"
              alt="RELA"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-gray-500 hover:text-black transition-colors duration-200 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {!loadingPerfil && perfil?.rol === "admin" && (
              <Link
                href="/admin"
                className="text-sm text-gray-500 hover:text-black transition-colors duration-200 relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </div>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/account/orders"
                  className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Mis órdenes
                </Link>
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.nombre || user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-400 hover:text-black transition-colors duration-200"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
              >
                Iniciar sesión
              </Link>
            )}

            <div className="w-px h-4 bg-gray-200" />

            {/* Carrito desktop — con ref para la animación */}
            <button
              ref={cartIconRef}
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors duration-200"
              aria-label="Abrir carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                className={cartBounce ? "animate-bounce" : ""}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              {totalItems > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center transition-transform ${
                    cartBounce ? "scale-125" : "scale-100"
                  }`}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Hamburguesa — solo móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden flex flex-col justify-center gap-1.5 p-1 w-8 h-8"
            aria-label="Abrir menú"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 origin-center bg-black ${menuAbierto ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 bg-black ${menuAbierto ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 origin-center bg-black ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Menú móvil */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-black overflow-hidden transition-all duration-300 ease-in-out ${
            menuAbierto ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-8 pt-6 pb-8 space-y-1">
            {links.map(({ href, label }, index) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAbierto(false)}
                className="flex items-baseline gap-4 group py-3 border-b border-white/10"
              >
                <span className="text-[10px] text-white/25 font-mono">
                  0{index + 1}
                </span>
                <span className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors duration-200 tracking-wide">
                  {label}
                </span>
              </Link>
            ))}

            {!loadingPerfil && perfil?.rol === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMenuAbierto(false)}
                className="flex items-baseline gap-4 group py-3 border-b border-white/10"
              >
                <span className="text-[10px] text-white/25 font-mono">04</span>
                <span className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors duration-200 tracking-wide">
                  Admin
                </span>
              </Link>
            )}

            {user && (
              <div className="pt-4 mt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    {user.user_metadata?.nombre || user.email}
                  </span>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuAbierto(false);
                    }}
                    className="text-xs text-white/30 hover:text-white transition-colors duration-200"
                  >
                    Salir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </>
  );
}
