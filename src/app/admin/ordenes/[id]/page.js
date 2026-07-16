import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import CambiarEstadoOrden from "@/components/admin/CambiarEstadoOrden";
import GuiaOrden from "@/components/admin/GuiaOrden";
import { ESTADO_COLORES as estadoColores } from "@/lib/estadosOrden";

export default async function DetalleOrden({ params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: orden, error } = await supabase
    .from("ordenes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !orden) return notFound();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("nombre, id")
    .eq("id", orden.usuario_id)
    .single();

  return (
    <div className="p-8 max-w-4xl">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orden #{orden.id}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(orden.created_at).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${estadoColores[orden.estado] || "bg-gray-100 text-gray-700"}`}>
          {orden.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Columna principal */}
        <div className="md:col-span-2 space-y-6">

          {/* Productos */}
          <div className="bg-white rounded shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Productos</h2>
            </div>

            {!orden.items || orden.items.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">Sin detalle de productos.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {orden.items.map((item, i) => (
                  <div key={i} className="p-4 flex gap-4 items-center">
                    <div className="w-14 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                      {item.imagen && <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[item.talla && `Talla: ${item.talla}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}
                      </p>
                      <p className="text-xs text-gray-400">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">${Number(orden.total).toLocaleString("es-CO")}</span>
            </div>
          </div>

          {/* Datos de envío */}
          {(orden.nombre_cliente || orden.direccion) && (
            <div className="bg-white rounded shadow-sm border border-gray-100 p-4 space-y-2">
              <h2 className="font-semibold text-gray-900 mb-3">Datos de envío</h2>
              {orden.nombre_cliente && <p className="text-sm text-gray-700"><span className="font-medium">Nombre:</span> {orden.nombre_cliente}</p>}
              {orden.telefono && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Teléfono:</span>{" "}
                  <a href={`https://wa.me/57${orden.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    {orden.telefono}
                  </a>
                </p>
              )}
              {orden.direccion && <p className="text-sm text-gray-700"><span className="font-medium">Dirección:</span> {orden.direccion}</p>}
              {orden.ciudad && <p className="text-sm text-gray-700"><span className="font-medium">Ciudad:</span> {orden.ciudad}{orden.departamento && `, ${orden.departamento}`}</p>}
              {orden.notas && <p className="text-sm text-gray-700"><span className="font-medium">Notas:</span> {orden.notas}</p>}
            </div>
          )}
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">

          {/* Cliente */}
          <div className="bg-white rounded shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Cliente</h2>
            <p className="text-sm text-gray-700">{perfil?.nombre || orden.nombre_cliente || "Cliente"}</p>
            {orden.usuario_id && (
              <p className="text-xs text-gray-400 mt-1">ID: {orden.usuario_id.slice(0, 8)}...</p>
            )}
            {orden.telefono && (
              <a href={`https://wa.me/57${orden.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2 text-xs text-green-600 hover:text-green-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contactar por WhatsApp
              </a>
            )}
          </div>

          {/* Cambiar estado */}
          <CambiarEstadoOrden ordenId={orden.id} estadoActual={orden.estado} />

          {/* Número de guía */}
          <GuiaOrden ordenId={orden.id} guiaActual={orden.numero_guia} />
        </div>

      </div>
    </div>
  );
}
