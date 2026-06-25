import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ui/ProductDetailClient";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: producto } = await supabase
    .from("productos")
    .select("nombre, descripcion, imagenes")
    .eq("slug", slug)
    .single();

  if (!producto) return { title: "Producto no encontrado" };

  return {
    title: producto.nombre,
    description: producto.descripcion || `Compra ${producto.nombre} en RELA`,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion || `Compra ${producto.nombre} en RELA`,
      images: producto.imagenes?.[0] ? [{ url: producto.imagenes[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: producto, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (error || !producto) return notFound();

  const { data: variantes } = await supabase
    .from("producto_variantes")
    .select(`stock, colores(id, nombre), tallas(id, nombre)`)
    .eq("producto_id", producto.id);

  const stockTotal = variantes?.length
    ? variantes.reduce((sum, v) => sum + v.stock, 0)
    : producto.stock;

  // Productos relacionados: misma categoría, distinto slug, máx 4
  const { data: relacionados } = await supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("activo", true)
    .eq("categoria_id", producto.categoria_id)
    .neq("slug", slug)
    .limit(4);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <ProductDetailClient
        producto={producto}
        stockTotal={stockTotal}
        variantes={variantes || []}
      />

      {relacionados && relacionados.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-100">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">También te puede gustar</span>
              <h2 className="mt-1 text-2xl font-serif font-bold text-gray-900">Productos relacionados</h2>
            </div>
            <Link href="/products" className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relacionados.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
