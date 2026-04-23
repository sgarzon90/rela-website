"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { user, signOut, perfil } = useAuth();
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
            src="/logo3.png"
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
          {perfil?.rol === "admin" && (
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-black transition-colors duration-200 relative group"
            >
              Admin
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
        </div>

        {/* Acciones lado derecho */}
        <div className="flex items-center gap-4">
          {/* Ícono usuario móvil */}
          {!user && (
            <Link
              href="/auth/login"
              className="md:hidden text-gray-500 hover:text-black transition-colors duration-200"
              aria-label="Iniciar sesión"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </Link>
          )}

          {/* Usuario desktop */}
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
          </div>

          {/* Separador desktop */}
          <div className="hidden md:block w-px h-4 bg-gray-200" />

          {/* Carrito */}
          <button
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburguesa */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden flex flex-col justify-center gap-1.5 p-1 w-8 h-8"
            aria-label="Abrir menú"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 origin-center ${menuAbierto ? "rotate-45 translate-y-2 bg-black" : "bg-black"}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${menuAbierto ? "opacity-0 scale-x-0 bg-black" : "bg-black"}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 origin-center ${menuAbierto ? "-rotate-45 -translate-y-2 bg-black" : "bg-black"}`}
            />
          </button>
        </div>
      </div>

      {/* Menú móvil — dropdown negro debajo del navbar */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-black overflow-hidden transition-all duration-400 ease-in-out ${
          menuAbierto ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-8 pt-6 pb-8 space-y-1">
          {/* Links */}
          {links.map(({ href, label }, index) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuAbierto(false)}
              className="flex items-baseline gap-4 group py-3 border-b border-white/10 transition-all duration-200"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="text-[10px] text-white/25 font-mono">
                0{index + 1}
              </span>
              <span className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors duration-200 tracking-wide">
                {label}
              </span>
            </Link>
          ))}

          {perfil?.rol === "admin" && (
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

          {/* Usuario logueado */}
          {user && (
            <div className="pt-4 mt-2 border-t border-white/10">
              <Link
                href="/account/orders"
                onClick={() => setMenuAbierto(false)}
                className="block text-sm text-white/50 hover:text-white transition-colors duration-200 py-2"
              >
                Mis órdenes
              </Link>
              <div className="flex items-center justify-between mt-1">
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

          {/* Redes sociales */}
          <div className="flex gap-5 pt-5">
            <a
              href="https://www.instagram.com/rela_tienda/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors duration-200"
              aria-label="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
