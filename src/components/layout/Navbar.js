import Link from "next/link"

export default function Navbar() {
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
          <Link href="/productos" className="text-sm text-gray-600 hover:text-black transition-colors">
            Productos
          </Link>
          <Link href="/nosotros" className="text-sm text-gray-600 hover:text-black transition-colors">
            Nosotros
          </Link>
        </div>

        {/* Carrito */}
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
          🛒 <span>Carrito (0)</span>
        </button>

      </div>
    </nav>
  )
}