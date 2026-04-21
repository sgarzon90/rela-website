import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-widest">
              RELA
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs leading-relaxed">
              Ropa diseñada para quienes no necesitan seguir tendencias. Solo ser ellos mismos.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                TikTok
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">Tienda</h3>
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
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">Ayuda</h3>
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
  )
}