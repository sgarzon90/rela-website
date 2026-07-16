import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { ESTADO_COLORES as estadoColores } from "@/lib/estadosOrden";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();
  const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1).toISOString();

  const [
    { count: totalProductos },
    { data: todasOrdenes },
    { data: ordenesRecientes },
    { data: productosStockBajo },
  ] = await Promise.all([
    supabase.from("productos").select("*", { count: "exact", head: true }).eq("activo", true),
    supabase.from("ordenes").select("total, estado, created_at, usuario_id, nombre_cliente"),
    supabase.from("ordenes").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("productos").select("id, nombre, stock, imagenes").eq("activo", true).lt("stock", 10).order("stock").limit(6),
  ]);

  // Métricas calculadas
  const ordenesFiltradas = (todasOrdenes || []).filter(o => o.estado !== "cancelado");
  const ingresoTotal = ordenesFiltradas.reduce((sum, o) => sum + Number(o.total), 0);

  const ordenesMes = (todasOrdenes || []).filter(o => o.created_at >= inicioMes && o.estado !== "cancelado");
  const ingresosMes = ordenesMes.reduce((sum, o) => sum + Number(o.total), 0);

  const ordenesMesAnterior = (todasOrdenes || []).filter(o =>
    o.created_at >= inicioMesAnterior && o.created_at < inicioMes && o.estado !== "cancelado"
  );
  const ingresosMesAnterior = ordenesMesAnterior.reduce((sum, o) => sum + Number(o.total), 0);
  const variacionIngresos = ingresosMesAnterior > 0
    ? Math.round(((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100)
    : null;

  const pendientes = (todasOrdenes || []).filter(o => o.estado === "pendiente").length;
  const promedioOrden = ordenesFiltradas.length > 0
    ? Math.round(ingresoTotal / ordenesFiltradas.length)
    : 0;

  // Conteo por estado
  const porEstado = (todasOrdenes || []).reduce((acc, o) => {
    acc[o.estado] = (acc[o.estado] || 0) + 1;
    return acc;
  }, {});

  // Nombres de clientes para órdenes recientes
  const usuarioIds = [...new Set(ordenesRecientes?.map(o => o.usuario_id).filter(Boolean))];
  let perfilesMap = {};
  if (usuarioIds.length > 0) {
    const { data: perfiles } = await supabase.from("perfiles").select("id, nombre").in("id", usuarioIds);
    perfiles?.forEach(p => { perfilesMap[p.id] = p.nombre; });
  }

  return (
    <div className="p-6 md:p-8 space-y-8">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400">
          {ahora.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Ingresos totales</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${ingresoTotal.toLocaleString("es-CO")}
          </p>
          <p className="text-xs text-gray-400 mt-1">{ordenesFiltradas.length} órdenes</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Este mes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${ingresosMes.toLocaleString("es-CO")}
          </p>
          {variacionIngresos !== null && (
            <p className={`text-xs mt-1 font-medium ${variacionIngresos >= 0 ? "text-green-600" : "text-red-500"}`}>
              {variacionIngresos >= 0 ? "↑" : "↓"} {Math.abs(variacionIngresos)}% vs mes anterior
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Ticket promedio</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${promedioOrden.toLocaleString("es-CO")}
          </p>
          <p className="text-xs text-gray-400 mt-1">por orden</p>
        </div>

        <div className={`p-5 rounded-lg border shadow-sm ${pendientes > 0 ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-100"}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pendientes</p>
          <p className={`text-2xl font-bold mt-1 ${pendientes > 0 ? "text-yellow-700" : "text-gray-900"}`}>
            {pendientes}
          </p>
          <Link href="/admin/ordenes" className="text-xs text-gray-400 hover:text-black mt-1 inline-block underline">
            Ver órdenes →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Órdenes por estado */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Estado de órdenes</h2>
          <div className="space-y-2">
            {["pendiente", "pagado", "enviado", "entregado", "cancelado"].map(estado => (
              <div key={estado} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${estadoColores[estado]}`}>
                  {estado}
                </span>
                <span className="text-sm font-semibold text-gray-900">{porEstado[estado] || 0}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/ordenes" className="mt-4 block text-xs text-gray-400 hover:text-black underline">
            Gestionar órdenes →
          </Link>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-2">
            <Link href="/admin/productos/new"
              className="flex items-center gap-3 px-3 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nuevo producto
            </Link>
            <Link href="/admin/ordenes"
              className="flex items-center gap-3 px-3 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5" />
              </svg>
              Ver órdenes pendientes
            </Link>
            <Link href="/admin/productos"
              className="flex items-center gap-3 px-3 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              </svg>
              Gestionar productos
            </Link>
            <Link href="/" target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Ver tienda
            </Link>
          </div>
        </div>

        {/* Stock bajo */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Stock bajo
            {productosStockBajo && productosStockBajo.length > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                {productosStockBajo.length}
              </span>
            )}
          </h2>
          {!productosStockBajo?.length ? (
            <p className="text-sm text-gray-400">Todo el inventario está bien.</p>
          ) : (
            <div className="space-y-2">
              {productosStockBajo.map(p => (
                <Link key={p.id} href={`/admin/productos/${p.id}`}
                  className="flex items-center gap-3 hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors">
                  <div className="w-8 h-8 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {p.imagenes?.[0] && <img src={p.imagenes[0]} alt={p.nombre} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{p.nombre}</p>
                    <p className={`text-xs font-semibold ${p.stock === 0 ? "text-red-600" : "text-orange-500"}`}>
                      {p.stock === 0 ? "Agotado" : `${p.stock} unidades`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/admin/productos" className="mt-4 block text-xs text-gray-400 hover:text-black underline">
            Ver todos los productos →
          </Link>
        </div>

      </div>

      {/* Órdenes recientes */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Órdenes recientes</h2>
          <Link href="/admin/ordenes" className="text-xs text-gray-400 hover:text-black underline">
            Ver todas →
          </Link>
        </div>
        {!ordenesRecientes?.length ? (
          <p className="p-6 text-sm text-gray-400">No hay órdenes aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  {["#", "Cliente", "Estado", "Total", "Fecha"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordenesRecientes.map(orden => (
                  <tr key={orden.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium">
                      <Link href={`/admin/ordenes/${orden.id}`} className="hover:underline text-gray-900">
                        #{orden.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {orden.nombre_cliente || perfilesMap[orden.usuario_id] || "Cliente"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${estadoColores[orden.estado] || "bg-gray-100 text-gray-700"}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      ${Number(orden.total).toLocaleString("es-CO")}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(orden.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
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
