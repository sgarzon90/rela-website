import Link from "next/link";

export default function ProductCard({ product }) {
  const imagen = product.imagenes?.[0] || "https://via.placeholder.com/400x533";
  const categoria = product.categorias?.nombre || product.categoria || "";

  return (
    <Link href={`/products/${product.slug}`} className="group">
      {/* Imagen con overlay suave al hacer hover */}
      <div className="bg-arena aspect-[3/4] overflow-hidden relative">
        <img
          src={imagen}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Overlay sutil al hacer hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Info del producto */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          {categoria}
        </p>
        {/* Nombre en serif para elegancia */}
        <h3 className="mt-1 text-sm font-serif font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.nombre}
        </h3>
        <p className="mt-1 text-sm text-gray-700">
          ${Number(product.precio).toLocaleString("es-CO")}
        </p>
      </div>
    </Link>
  );
}
