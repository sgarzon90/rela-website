import ProductCard from "@/components/ui/ProductCard"
import FadeIn from "@/components/ui/FadeIn"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function FeaturedProducts() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("activo", true)
    .order("created_at", { ascending: false })
    .limit(4)

  if (error || !productos?.length) return null

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">

      {/* Encabezado con animación */}
      <FadeIn>
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Lo más nuevo
            </span>
            <h2 className="mt-2 text-3xl font-serif font-bold text-gray-900">
              Destacados
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4"
          >
            Ver todos →
          </Link>
        </div>
      </FadeIn>

      {/* Grid con animación escalonada — cada tarjeta entra con un delay diferente */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {productos.map((product, index) => (
          <FadeIn key={product.id} delay={index * 0.1} direction="up">
            <ProductCard product={product} />
          </FadeIn>
        ))}
      </div>

    </section>
  )
}