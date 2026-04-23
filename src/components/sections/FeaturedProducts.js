import ProductCard from "@/components/ui/ProductCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Este componente es async porque necesita esperar los datos de la BD
export default async function FeaturedProducts() {
  // Traemos los 4 productos más recientes de la base de datos
  const { data: productos, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("activo", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // Si hay error o no hay productos, no mostramos la sección
  if (error || !productos?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Encabezado de la sección */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
            Lo más nuevo
          </span>
          <h2 className="mt-2 text-3xl font-serif font-bold text-gray-900">
            Destacados
          </h2>
        </div>
        {/* Link para ver todos los productos */}
        <Link
          href="/products"
          className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4"
        >
          Ver todos →
        </Link>
      </div>

      {/* Grid de tarjetas de productos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {productos.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
