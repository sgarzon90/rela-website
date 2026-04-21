import Link from "next/link"

export default function ProductCard({ product }) {
  return (
    <Link href={`/productos/${product.id}`} className="group">
      
      {/* Imagen */}
      <div className="bg-gray-100 aspect-[3/4] overflow-hidden">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          {product.categoria}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-gray-900">
          {product.nombre}
        </h3>
        <p className="mt-1 text-sm text-gray-700">
          ${product.precio.toLocaleString("es-CO")}
        </p>
      </div>

    </Link>
  )
}