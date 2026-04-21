import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
// Importamos el botón interactivo del carrito
import AddToCartButton from "@/components/ui/AddToCartButton"

export default async function ProductPage({ params }) {
  // Obtenemos el slug de la URL para buscar el producto correcto
  const { slug } = await params

  // Buscamos el producto en la BD incluyendo su categoría
  const { data: producto, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("slug", slug)
    .eq("activo", true)
    .single()

  // Si no existe el producto mostramos página 404
  if (error || !producto) return notFound()

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Galería de imágenes del producto */}
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

        {/* Información y acciones del producto */}
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

          {/* Descripción del producto */}
          {producto.descripcion && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {producto.descripcion}
            </p>
          )}

          {/* Botón de agregar al carrito con selectores de talla y color */}
          <AddToCartButton product={producto} />

        </div>
      </div>
    </main>
  )
}