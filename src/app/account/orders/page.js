import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ESTADO_COLORES as estadoColores } from "@/lib/estadosOrden";

export default async function Orders() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: ordenes } = await supabase
    .from("ordenes")
    .select("*")
    .eq("usuario_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">Mi cuenta</span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Mis órdenes</h1>
      </div>

      {!ordenes || ordenes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">No tienes órdenes aún.</p>
          <Link href="/products" className="mt-4 inline-block text-sm underline underline-offset-4 text-gray-600 hover:text-black">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {ordenes.map((orden) => (
            <div key={orden.id} className="border border-gray-200 hover:border-gray-400 transition-colors group">
              {/* Cabecera de la orden */}
              <Link href={`/account/orders/${orden.id}`} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:underline">Orden #{orden.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(orden.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${estadoColores[orden.estado] || "bg-gray-100 text-gray-700"}`}>
                    {orden.estado}
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    ${Number(orden.total).toLocaleString("es-CO")}
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>

              {/* Items de la orden */}
              {orden.items?.length > 0 && (
                <div className="px-6 py-4 space-y-3">
                  {orden.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                        {item.imagen && <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{item.nombre}</p>
                        <p className="text-xs text-gray-400">
                          {[item.talla && `Talla: ${item.talla}`, item.color && `Color: ${item.color}`, `× ${item.cantidad}`].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 flex-shrink-0">
                        ${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Número de guía */}
              {orden.numero_guia && (
                <div className="px-6 py-3 border-t border-gray-100 bg-purple-50">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-purple-600 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <p className="text-xs text-purple-700 font-medium">
                      Número de guía: <span className="font-bold tracking-wide">{orden.numero_guia}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Dirección de envío */}
              {orden.direccion && (
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500">
                    Envío a: {orden.direccion}, {orden.ciudad} — {orden.departamento}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
