import { createClient } from "@/lib/supabase-server";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

export async function generateMetadata({ searchParams }) {
  const q = (await searchParams).q || "";
  return { title: q ? `Resultados para "${q}" — RELA` : "Buscar — RELA" };
}

export default async function SearchPage({ searchParams }) {
  const q = ((await searchParams).q || "").trim();

  let productos = [];
  if (q) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("productos")
      .select("id, nombre, slug, precio, imagenes, stock, categorias(nombre, slug)")
      .eq("activo", true)
      .or(`nombre.ilike.%${q}%,descripcion.ilike.%${q}%`)
      .order("nombre");
    productos = data || [];
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `Resultados para "${q}"` : "Buscar productos"}
        </h1>
        {q && (
          <p className="text-sm text-gray-500 mt-1">
            {productos.length === 0
              ? "No encontramos productos que coincidan."
              : `${productos.length} producto${productos.length !== 1 ? "s" : ""} encontrado${productos.length !== 1 ? "s" : ""}`}
          </p>
        )}
      </div>

      {!q && (
        <p className="text-gray-500 text-sm">Escribe algo en la barra de búsqueda para encontrar productos.</p>
      )}

      {q && productos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm mb-4">Intenta con otro término o explora el catálogo completo.</p>
          <Link href="/products" className="inline-block bg-black text-white text-sm px-6 py-3 hover:bg-gray-800 transition-colors">
            Ver todos los productos
          </Link>
        </div>
      )}

      {productos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </main>
  );
}
