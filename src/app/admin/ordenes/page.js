import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminOrdenes({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;
  const estadoFiltro = params?.estado || "todas";

  // Construimos la query base trayendo también los datos del usuario
  let query = supabase
    .from("ordenes")
    .select(
      `
      *,
      perfiles (
        nombre
      )
    `,
    )
    .order("created_at", { ascending: false });

  // Aplicamos filtro de estado si existe
  if (estadoFiltro !== "todas") {
    query = query.eq("estado", estadoFiltro);
  }

  const { data: ordenes, error } = await query;

  if (error) {
    return (
      <p className="p-8 text-red-500">
        Error cargando órdenes: {error.message}
      </p>
    );
  }

  // Colores para cada estado de la orden
  const estadoColores = {
    pendiente: "bg-yellow-100 text-yellow-700",
    pagado: "bg-blue-100 text-blue-700",
    enviado: "bg-purple-100 text-purple-700",
    entregado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
  };

  const estados = [
    "todas",
    "pendiente",
    "pagado",
    "enviado",
    "entregado",
    "cancelado",
  ];

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
        <p className="text-sm text-gray-500 mt-1">
          {ordenes?.length || 0} órdenes encontradas
        </p>
      </div>

      {/* Filtros por estado */}
      <div className="flex gap-2 flex-wrap mb-6">
        {estados.map((estado) => (
          <Link
            key={estado}
            href={`/admin/ordenes${estado !== "todas" ? `?estado=${estado}` : ""}`}
            className={`px-4 py-2 text-xs font-medium border transition-colors capitalize ${
              estadoFiltro === estado
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-black"
            }`}
          >
            {estado}
          </Link>
        ))}
      </div>

      {/* Tabla de órdenes */}
      <div className="bg-white rounded shadow-sm border border-gray-100 overflow-x-auto">
        {!ordenes || ordenes.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">
            No hay órdenes con este estado.
          </p>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Orden
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordenes.map((orden) => (
                <tr key={orden.id} className="hover:bg-gray-50">
                  {/* ID de la orden */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{orden.id}
                  </td>

                  {/* Nombre del cliente */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {orden.perfiles?.nombre || "Cliente"}
                  </td>

                  {/* Estado con color */}
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

                  {/* Total */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${Number(orden.total).toLocaleString("es-CO")}
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(orden.created_at).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Link al detalle */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/ordenes/${orden.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
