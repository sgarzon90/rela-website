import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminDashboard() {
  // Usamos el cliente del servidor para respetar RLS con sesión de admin
  const supabase = await createClient();

  // Total de productos
  const { count: totalProductos } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true });

  // Total de órdenes
  const { count: totalOrdenes } = await supabase
    .from("ordenes")
    .select("*", { count: "exact", head: true });

  // Órdenes recientes
  const { data: ordenes } = await supabase
    .from("ordenes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Traemos los nombres de los clientes por separado
  const usuarioIds = [
    ...new Set(ordenes?.map((o) => o.usuario_id).filter(Boolean)),
  ];
  let perfilesMap = {};

  if (usuarioIds.length > 0) {
    const { data: perfiles } = await supabase
      .from("perfiles")
      .select("id, nombre")
      .in("id", usuarioIds);
    perfiles?.forEach((p) => {
      perfilesMap[p.id] = p.nombre;
    });
  }

  // Colores por estado
  const estadoColores = {
    pendiente: "bg-yellow-100 text-yellow-700",
    pagado: "bg-blue-100 text-blue-700",
    enviado: "bg-purple-100 text-purple-700",
    entregado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total productos</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {totalProductos || 0}
          </p>
          <Link
            href="/admin/productos"
            className="text-xs text-gray-400 hover:text-black mt-2 inline-block underline"
          >
            Ver todos →
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total órdenes</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {totalOrdenes || 0}
          </p>
          <Link
            href="/admin/ordenes"
            className="text-xs text-gray-400 hover:text-black mt-2 inline-block underline"
          >
            Ver todas →
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Acciones rápidas</p>
          <Link
            href="/admin/productos/new"
            className="mt-2 inline-block bg-black text-white px-4 py-2 text-xs font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            + NUEVO PRODUCTO
          </Link>
        </div>
      </div>

      {/* Órdenes recientes */}
      <div className="bg-white rounded shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Órdenes recientes
          </h2>
          <Link
            href="/admin/ordenes"
            className="text-xs text-gray-400 hover:text-black underline"
          >
            Ver todas →
          </Link>
        </div>

        {!ordenes || ordenes.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No hay órdenes aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordenes.map((orden) => (
                  <tr key={orden.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <Link
                        href={`/admin/ordenes/${orden.id}`}
                        className="hover:underline"
                      >
                        #{orden.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {perfilesMap[orden.usuario_id] || "Cliente"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          estadoColores[orden.estado] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${Number(orden.total).toLocaleString("es-CO")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(orden.created_at).toLocaleDateString("es-CO")}
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
