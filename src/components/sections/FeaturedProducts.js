import ProductCard from "@/components/ui/ProductCard"
import { productosEjemplo } from "@/lib/data"


export default function FeaturedProducts() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">

      {/* Título de la sección */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
            Lo más nuevo
          </span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Destacados
          </h2>
        </div>
        <a href="/productos" className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4">
          Ver todos →
        </a>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {productosEjemplo.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  )
}