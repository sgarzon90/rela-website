import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/ui/ProductCard"

export default async function Productos() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select(`
      *,
      categorias (
        nombre,
        slug
      )
    `)
    .eq("activo", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return <p>Error cargando productos</p>
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">

      {/* Encabezado */}
      <div className="mb-10">
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          Colección
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Todos los productos
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {productos.length} productos
        </p>
      </div>

      {/* Grid */}
      {productos.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          No hay productos disponibles aún.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      )}

    </main>
  )
}