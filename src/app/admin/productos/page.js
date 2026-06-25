import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminProductos({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;
  const q = params?.q || "";

  let query = supabase
    .from("productos")
    .select(`*, categorias(nombre)`)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("nombre", `%${q}%`);
  }

  const { data: productos, error } = await query;

  if (error) {
    return <p className="p-8 text-red-500">Error cargando productos</p>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/new"
          className="bg-black text-white px-6 py-2 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
        >
          + NUEVO
        </Link>
      </div>

      {/* Búsqueda */}
      <form method="GET" className="mb-6 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre..."
          className="flex-1 max-w-xs border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
          Buscar
        </button>
        {q && (
          <Link href="/admin/productos" className="px-4 py-2 text-sm border border-gray-300 text-gray-600 hover:border-black transition-colors">
            Limpiar
          </Link>
        )}
      </form>

      <div className="bg-white rounded shadow-sm border border-gray-100">
        {!productos?.length ? (
          <p className="p-6 text-sm text-gray-400">
            {q ? `No se encontraron productos para "${q}".` : "No hay productos aún."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  {["Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                          {producto.imagenes?.[0] && (
                            <img src={producto.imagenes[0]} alt={producto.nombre} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{producto.nombre}</p>
                          <p className="text-xs text-gray-400">{producto.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{producto.categorias?.nombre || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${Number(producto.precio).toLocaleString("es-CO")}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={producto.stock <= 3 ? "text-red-600 font-semibold" : producto.stock <= 10 ? "text-orange-500 font-medium" : "text-gray-900"}>
                        {producto.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${producto.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {producto.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/productos/${producto.id}`} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                          Editar
                        </Link>
                        <Link href={`/products/${producto.slug}`} target="_blank" className="text-sm text-gray-400 hover:text-black transition-colors">
                          Ver →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">{productos?.length || 0} producto{productos?.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
