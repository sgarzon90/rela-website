"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { user, signOut, perfil, loadingPerfil } = useAuth();
  const { cartIconRef, cartBottomRef, cartBounce } = useFlyToCart();
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar drawer al cambiar de ruta
  useEffect(() => {
    setDrawerAbierto(false);
  }, [pathname]);

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = drawerAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerAbierto]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setDrawerAbierto(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const links = [
    {
      href: "/",
      label: "Inicio",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
    {
      href: "/products",
      label: "Productos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 6h.008v.008H6V6z"
          />
        </svg>
      ),
    },
    {
      href: "/about",
      label: "Nosotros",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
          />
        </svg>
      ),
    },
    {
      href: "/contact",
      label: "Contacto",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      ),
    },
  ];

  // Links para la bottom bar (los más importantes)
  const bottomLinks = [
    {
      href: "/",
      label: "Inicio",
      icon: (
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
            d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
          />
        </svg>
      ),
    },
    {
      href: "/products",
      label: "Productos",
      icon: (
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
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 6h.008v.008H6V6z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─── NAVBAR PRINCIPAL ─── */}
      <nav
        className={`bg-white px-6 py-2 fixed top-0 left-0 right-0 z-40 transition-shadow duration-300 ${
          scrolled
            ? "shadow-md border-b border-gray-100"
            : "border-b border-gray-100"
        }`}
      >
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
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
                className={`text-sm transition-colors duration-200 relative group ${
                  isActive(href)
                    ? "text-black font-semibold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-black transition-all duration-300 ${
                    isActive(href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
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
                  className={`absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center transition-transform ${cartBounce ? "scale-125" : "scale-100"}`}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            onClick={() => setDrawerAbierto(!drawerAbierto)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Abrir menú"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span
                className={`block h-[1.5px] bg-black transition-all duration-300 origin-center ${drawerAbierto ? "rotate-45 translate-y-[6.5px]" : ""}`}
              />
              <span
                className={`block h-[1.5px] bg-black transition-all duration-300 ${drawerAbierto ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block h-[1.5px] bg-black transition-all duration-300 origin-center ${drawerAbierto ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Espaciador para el navbar fijo */}
      <div className="h-[72px]" />

      {/* ─── OVERLAY del drawer ─── */}
      <div
        onClick={() => setDrawerAbierto(false)}
        className={`md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerAbierto
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ─── DRAWER LATERAL DERECHO ─── */}
      <div
        ref={drawerRef}
        className={`md:hidden fixed top-0 right-0 h-full w-[78vw] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          drawerAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link href="/" onClick={() => setDrawerAbierto(false)}>
            <img
              src="/Logo3.png"
              alt="RELA"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setDrawerAbierto(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Links de navegación */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase px-3 mb-3">
            Navegación
          </p>
          <ul className="space-y-1">
            {links.map(({ href, label, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setDrawerAbierto(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(href)
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <span
                    className={`transition-colors ${isActive(href) ? "text-white" : "text-gray-400 group-hover:text-black"}`}
                  >
                    {icon}
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                  {isActive(href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              </li>
            ))}
            {!loadingPerfil && perfil?.rol === "admin" && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setDrawerAbierto(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200"
                >
                  <span className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">Admin</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />

          {/* Cuenta */}
          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase px-3 mb-3">
            Cuenta
          </p>
          {user ? (
            <div className="space-y-1">
              <Link
                href="/account/orders"
                onClick={() => setDrawerAbierto(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                  />
                </svg>
                <span className="text-sm font-medium">Mis órdenes</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setDrawerAbierto(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setDrawerAbierto(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <span className="text-sm font-medium">Iniciar sesión</span>
            </Link>
          )}
        </nav>

        {/* Footer del drawer */}
        {user && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase">
                {(user.user_metadata?.nombre || user.email || "U")[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {user.user_metadata?.nombre || "Mi cuenta"}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM BAR MÓVIL ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]">
          {/* Inicio */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive("/") ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isActive("/") ? 2 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
              />
            </svg>
            <span
              className={`text-[10px] font-medium ${isActive("/") ? "text-black" : "text-gray-400"}`}
            >
              Inicio
            </span>
            {isActive("/") && (
              <span className="w-1 h-1 rounded-full bg-black" />
            )}
          </Link>

          {/* Productos */}
          <Link
            href="/products"
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive("/products")
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isActive("/products") ? 2 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6z"
              />
            </svg>
            <span
              className={`text-[10px] font-medium ${isActive("/products") ? "text-black" : "text-gray-400"}`}
            >
              Productos
            </span>
            {isActive("/products") && (
              <span className="w-1 h-1 rounded-full bg-black" />
            )}
          </Link>

          {/* Carrito — botón central destacado */}
          <button
            ref={cartBottomRef}
            onClick={() => setIsOpen(true)}
            className="relative flex flex-col items-center gap-1 px-4 py-1.5"
            aria-label="Abrir carrito"
          >
            <div
              className={`relative w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95 ${cartBounce ? "animate-bounce" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black transition-transform ${cartBounce ? "scale-125" : "scale-100"}`}
                >
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-400">
              Carrito
            </span>
          </button>

          {/* Cuenta / Login */}
          <Link
            href={user ? "/account/orders" : "/auth/login"}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive("/auth") || isActive("/account")
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {user ? (
              <div className="w-[22px] h-[22px] rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold uppercase">
                {(user.user_metadata?.nombre || user.email || "U")[0]}
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
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
            )}
            <span className="text-[10px] font-medium text-gray-400">
              {user ? "Cuenta" : "Entrar"}
            </span>
          </Link>
        </div>
      </div>

      {/* Espaciador para la bottom bar en móvil */}
      <div className="md:hidden h-20" />
    </>
  );
}
