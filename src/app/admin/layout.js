import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({ children }) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect("/auth/login")

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .single()

  if (!perfil || perfil.rol !== "admin") redirect("/")

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header móvil del admin */}
      <header className="md:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <Link href="/" className="text-lg font-bold tracking-widest">RELA</Link>
        <p className="text-xs text-gray-400">Admin</p>
      </header>

      <div className="flex">

        {/* Sidebar — oculto en móvil, visible en desktop */}
        <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-shrink-0 flex-col min-h-screen sticky top-0">
          <div className="p-6 border-b border-gray-700">
            <Link href="/" className="text-xl font-bold tracking-widest">
              RELA
            </Link>
            <p className="text-xs text-gray-400 mt-1">Panel de administración</p>
          </div>

          <nav className="p-4 space-y-1 flex-1">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
              📊 Dashboard
            </Link>
            <Link href="/admin/productos" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
              👕 Productos
            </Link>
            <Link href="/admin/productos/new" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
              ➕ Nuevo producto
            </Link>
            <Link href="/admin/categorias" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
              🏷️ Categorías
            </Link>
            <Link href="/admin/colores" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
              🎨 Colores
            </Link>
            <Link href="/admin/ordenes" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
              📦 Órdenes
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              ← Volver a la tienda
            </Link>
          </div>
        </aside>

        {/* Navegación móvil del admin — barra horizontal */}
        <div className="md:hidden w-full">
          <nav className="bg-gray-900 text-white px-4 overflow-x-auto">
            <div className="flex gap-1 py-2 min-w-max">
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors whitespace-nowrap">
                📊 Dashboard
              </Link>
              <Link href="/admin/productos" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors whitespace-nowrap">
                👕 Productos
              </Link>
              <Link href="/admin/productos/new" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors whitespace-nowrap">
                ➕ Nuevo
              </Link>
              <Link href="/admin/categorias" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors whitespace-nowrap">
                🏷️ Categorías
              </Link>
              <Link href="/admin/colores" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors whitespace-nowrap">
                🎨 Colores
              </Link>
              <Link href="/admin/ordenes" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors whitespace-nowrap">
                📦 Órdenes
              </Link>
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                ← Tienda
              </Link>
            </div>
          </nav>

          {/* Contenido móvil */}
          <main className="p-4">
            {children}
          </main>
        </div>

        {/* Contenido desktop */}
        <main className="hidden md:block flex-1 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  )
}