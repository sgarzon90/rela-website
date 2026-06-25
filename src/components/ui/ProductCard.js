import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const imagen = product.imagenes?.[0];
  const categoria = product.categorias?.nombre || product.categoria || "";
  const tieneDescuento = product.precio_descuento && Number(product.precio_descuento) < Number(product.precio);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-gray-100 aspect-[3/4] overflow-hidden relative">
        {imagen ? (
          <Image
            src={imagen}
            alt={product.nombre}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} className="text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        {tieneDescuento && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider z-10">
            OFERTA
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest">{categoria}</p>
        <h3 className="mt-1 text-sm font-serif font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.nombre}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm text-gray-900">
            ${Number(tieneDescuento ? product.precio_descuento : product.precio).toLocaleString("es-CO")}
          </p>
          {tieneDescuento && (
            <p className="text-xs text-gray-400 line-through">
              ${Number(product.precio).toLocaleString("es-CO")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
