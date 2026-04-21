import Link from "next/link"

export default function ProductCard({ product }) {
  const imagen = product.imagenes?.[0] || "https://via.placeholder.com/400x533"
  const categoria = product.categorias?.nombre || product.categoria || ""

  return (
    <Link href={`/products/${product.slug}`} className="group">

      {/* Imagen */}
      <div className="bg-gray-100 aspect-[3/4] overflow-hidden">
        <img
          src={imagen}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          {categoria}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-gray-900">
          {product.nombre}
        </h3>
        <p className="mt-1 text-sm text-gray-700">
          ${Number(product.precio).toLocaleString("es-CO")}
        </p>
      </div>

    </Link>
  )
}