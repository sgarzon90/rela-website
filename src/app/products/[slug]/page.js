import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }) {
  const { slug } = await params

  const { data: producto, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("slug", slug)
    .eq("activo", true)
    .single()

  if (error || !producto) return notFound()

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Imágenes */}
        <div className="space-y-4">
          {producto.imagenes?.length > 0 ? (
            producto.imagenes.map((url, i) => (
              <div key={i} className="bg-gray-100 aspect-[3/4] overflow-hidden">
                <img
                  src={url}
                  alt={`${producto.nombre} - foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="bg-gray-100 aspect-[3/4]" />
          )}
        </div>

        {/* Info */}
        <div className="sticky top-6 space-y-6">

          {/* Categoría y nombre */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {producto.categorias?.nombre}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {producto.nombre}
            </h1>
            <p className="mt-3 text-2xl text-gray-900">
              ${Number(producto.precio).toLocaleString("es-CO")}
            </p>
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {producto.descripcion}
            </p>
          )}

          {/* Tallas */}
          {producto.tallas?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Talla</p>
              <div className="flex gap-2 flex-wrap">
                {producto.tallas.map((talla) => (
                  <button
                    key={talla}
                    className="px-4 py-2 text-sm border border-gray-300 hover:border-black transition-colors"
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colores */}
          {producto.colores?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {producto.colores.map((color) => (
                  <button
                    key={color}
                    className="px-4 py-2 text-sm border border-gray-300 hover:border-black transition-colors"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <p className="text-sm text-gray-500">
            {producto.stock > 0
              ? `${producto.stock} unidades disponibles`
              : "Agotado"}
          </p>

          {/* Botón agregar al carrito */}
          <button
            disabled={producto.stock === 0}
            className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {producto.stock > 0 ? "AGREGAR AL CARRITO" : "AGOTADO"}
          </button>

        </div>
      </div>
    </main>
  )
}