import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function AdminDashboard() {
  // Traemos estadísticas básicas de la base de datos
  const { count: totalProductos } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true })

  const { count: totalOrdenes } = await supabase
    .from("ordenes")
    .select("*", { count: "exact", head: true })

  const { data: ordenesRecientes } = await supabase
    .from("ordenes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

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
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Órdenes recientes
          </h2>
        </div>

        {ordenesRecientes?.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No hay órdenes aún.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordenesRecientes?.map((orden) => (
                <tr key={orden.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">#{orden.id}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      orden.estado === "pagado"
                        ? "bg-green-100 text-green-700"
                        : orden.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
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
        )}
      </div>
    </div>
  )
}