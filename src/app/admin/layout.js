import Link from "next/link"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">

      {/* Menú lateral del admin */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="text-xl font-bold tracking-widest">
            RELA
          </Link>
          <p className="text-xs text-gray-400 mt-1">Panel de administración</p>
        </div>

        {/* Links de navegación del admin */}
        <nav className="p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/productos"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            👕 Productos
          </Link>
          <Link
            href="/admin/productos/new"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            ➕ Nuevo producto
          </Link>
          <Link
            href="/admin/ordenes"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            📦 Órdenes
          </Link>
        </nav>

        {/* Link para volver a la tienda */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Contenido principal del admin */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>

    </div>
  )
}