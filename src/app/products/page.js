import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilters from "@/components/ui/ProductFilters";
import { Suspense } from "react";

export const metadata = {
  title: "Productos",
  description:
    "Explora toda la colección de RELA. Camisetas, hoodies, pantalones y más.",
};

export default async function Products({ searchParams }) {
  const params = await searchParams;
  const categoriaSlug = params?.categoria || null;
  const orden = params?.orden || "recientes";

  // Traemos todas las categorías para los filtros
  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre");

  // Construimos la query base de productos
  let query = supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("activo", true);

  // Si hay un filtro de categoría lo aplicamos
  if (categoriaSlug) {
    const categoria = categorias?.find((c) => c.slug === categoriaSlug);
    if (categoria) {
      query = query.eq("categoria_id", categoria.id);
    }
  }

  // Aplicamos el orden seleccionado
  if (orden === "precio-asc") {
    query = query.order("precio", { ascending: true });
  } else if (orden === "precio-desc") {
    query = query.order("precio", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: productos, error } = await query;

  if (error) {
    return <p className="p-8 text-red-500">Error cargando productos</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="mb-10">
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          Colección
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Todos los productos
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {productos.length} productos
        </p>
      </div>

      {/* Filtros — Suspense es necesario porque useSearchParams es async */}
      <Suspense fallback={<div className="h-12 mb-10" />}>
        <ProductFilters categorias={categorias || []} />
      </Suspense>

      {/* Grid de productos */}
      {productos.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </main>
  );
}
