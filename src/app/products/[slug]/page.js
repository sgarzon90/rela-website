import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/ui/AddToCartButton"
import ImageGallery from "@/components/ui/ImageGallery"

export default async function ProductPage({ params }) {
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

        {/* Galería de imágenes con carrusel */}
        <ImageGallery imagenes={producto.imagenes} nombre={producto.nombre} />

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