import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

const estadoColores = {
  pendiente: "bg-yellow-100 text-yellow-700",
  pagado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

const estadoDescripcion = {
  pendiente: "Recibimos tu pedido y lo estamos procesando.",
  pagado: "¡Pago confirmado! Estamos preparando tu pedido.",
  enviado: "Tu pedido está en camino.",
  entregado: "Tu pedido fue entregado. ¡Gracias por comprar en RELA!",
  cancelado: "Este pedido fue cancelado.",
};

export default async function OrdenDetallePage({ params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: orden, error } = await supabase
    .from("ordenes")
    .select("*")
    .eq("id", id)
    .eq("usuario_id", user.id)
    .single();

  if (error || !orden) return notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="mb-2">
        <Link href="/account/orders" className="text-xs text-gray-400 hover:text-black transition-colors">
          ← Mis órdenes
        </Link>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orden #{orden.id}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(orden.created_at).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${estadoColores[orden.estado] || "bg-gray-100 text-gray-700"}`}>
          {orden.estado}
        </span>
      </div>

      {/* Estado descriptivo */}
      <div className={`px-4 py-3 text-sm mb-6 border-l-4 ${orden.estado === "cancelado" ? "border-red-400 bg-red-50 text-red-700" : orden.estado === "enviado" ? "border-purple-400 bg-purple-50 text-purple-700" : orden.estado === "entregado" ? "border-green-400 bg-green-50 text-green-700" : "border-yellow-400 bg-yellow-50 text-yellow-700"}`}>
        {estadoDescripcion[orden.estado] || "Tu pedido está siendo procesado."}
      </div>

      {/* Número de guía */}
      {orden.numero_guia && (
        <div className="bg-purple-50 border border-purple-200 px-4 py-3 mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-purple-600 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <div>
            <p className="text-xs text-purple-600">Número de guía</p>
            <p className="text-sm font-bold text-purple-800 tracking-wide">{orden.numero_guia}</p>
          </div>
        </div>
      )}

      {/* Productos */}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Productos</h2>
        </div>
        {orden.items?.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orden.items.map((item, i) => (
              <div key={i} className="px-5 py-4 flex gap-4 items-center">
                <div className="w-14 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                  {item.imagen && <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {[item.talla && `Talla: ${item.talla}`, item.color && `Color: ${item.color}`, `× ${item.cantidad}`].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  ${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-4 text-sm text-gray-400">Sin detalle de productos.</p>
        )}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">${Number(orden.total).toLocaleString("es-CO")}</span>
        </div>
      </div>

      {/* Datos de envío */}
      {(orden.nombre_cliente || orden.direccion) && (
        <div className="bg-white border border-gray-200 px-5 py-4 space-y-1.5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Datos de envío</h2>
          {orden.nombre_cliente && <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Nombre:</span> {orden.nombre_cliente}</p>}
          {orden.telefono && <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Teléfono:</span> {orden.telefono}</p>}
          {orden.direccion && <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Dirección:</span> {orden.direccion}</p>}
          {orden.ciudad && <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Ciudad:</span> {orden.ciudad}{orden.departamento && `, ${orden.departamento}`}</p>}
          {orden.notas && <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Notas:</span> {orden.notas}</p>}
        </div>
      )}
    </main>
  );
}
