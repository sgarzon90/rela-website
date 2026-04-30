import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ImageGallery from "@/components/ui/ImageGallery";

export async function generateMetadata({ params }) {
  const { slug } = await params;

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

  const { data: producto, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre, slug)`)
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (error || !producto) return notFound();

  // Stock total real = suma de todas las variantes
  const { data: variantes } = await supabase
    .from("producto_variantes")
    .select("stock")
    .eq("producto_id", producto.id);

  const stockTotal = variantes?.length
    ? variantes.reduce((sum, v) => sum + v.stock, 0)
    : producto.stock;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ImageGallery imagenes={producto.imagenes} nombre={producto.nombre} />

        <div className="sticky top-6 space-y-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {producto.categorias?.nombre}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {producto.nombre}
            </h1>
            {/* Precio con descuento */}
            {producto.precio_descuento ? (
              <div className="mt-3 flex items-center gap-3">
                <p className="text-2xl text-gray-900 font-semibold">
                  ${Number(producto.precio_descuento).toLocaleString("es-CO")}
                </p>
                <p className="text-lg text-gray-400 line-through">
                  ${Number(producto.precio).toLocaleString("es-CO")}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-2xl text-gray-900">
                ${Number(producto.precio).toLocaleString("es-CO")}
              </p>
            )}
          </div>

          {producto.descripcion && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {producto.descripcion}
            </p>
          )}

          {/* Pasamos el producto con el stock total real */}
          <AddToCartButton product={{ ...producto, stock: stockTotal }} />
        </div>
      </div>
    </main>
  );
}
