import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Columna 1 — Logo y descripción */}
          <div className="col-span-2">
            {/* Logo — centrado en móvil, izquierda en desktop */}
            <Link href="/" className="block w-fit mx-auto md:mx-0">
              <img src="/Logo3-white.png" alt="RELA" className="h-12 w-auto" />
            </Link>

            {/* Texto — centrado en móvil, izquierda en desktop */}
            <p className="mt-4 text-sm text-gray-400 max-w-xs leading-relaxed text-center md:text-left mx-auto md:mx-0">
              Ropa diseñada para quienes no necesitan seguir tendencias. Solo
              ser ellos mismos.
            </p>

            {/* Iconos — centrados en móvil, izquierda en desktop */}
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/rela_tienda/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 — Tienda */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
              Tienda
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 — Ayuda */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
              Ayuda
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} RELA. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}