import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function AdminProductos() {
  // Traemos todos los productos incluyendo los inactivos
  const { data: productos, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre)`)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="p-8 text-red-500">Error cargando productos</p>;
  }

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/new"
          className="bg-black text-white px-6 py-2 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
        >
          + NUEVO
        </Link>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded shadow-sm border border-gray-100">
        {productos?.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No hay productos aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productos?.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    {/* Imagen y nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                          {producto.imagenes?.[0] && (
                            <img
                              src={producto.imagenes[0]}
                              alt={producto.nombre}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {producto.nombre}
                          </p>
                          <p className="text-xs text-gray-400">
                            {producto.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {producto.categorias?.nombre || "—"}
                    </td>

                    {/* Precio */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${Number(producto.precio).toLocaleString("es-CO")}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {producto.stock}
                    </td>

                    {/* Estado activo/inactivo */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          producto.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {producto.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/productos/${producto.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/products/${producto.slug}`}
                          target="_blank"
                          className="text-sm text-gray-400 hover:text-black transition-colors"
                        >
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
    </div>
  );
}
