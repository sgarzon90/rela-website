import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import CambiarEstadoOrden from "@/components/admin/CambiarEstadoOrden";

export default async function DetalleOrden({ params }) {
  const supabase = await createClient();
  const { id } = await params;

  // Traemos la orden con los datos del cliente y los items
  const { data: orden, error } = await supabase
    .from("ordenes")
    .select(
      `
      *,
      perfiles (nombre),
      orden_items (
        *,
        productos (nombre, imagenes, slug)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !orden) return notFound();

  // Colores para cada estado
  const estadoColores = {
    pendiente: "bg-yellow-100 text-yellow-700",
    pagado: "bg-blue-100 text-blue-700",
    enviado: "bg-purple-100 text-purple-700",
    entregado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orden #{orden.id}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(orden.created_at).toLocaleDateString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${
            estadoColores[orden.estado] || "bg-gray-100 text-gray-700"
          }`}
        >
          {orden.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna principal — items y total */}
        <div className="md:col-span-2 space-y-6">
          {/* Productos de la orden */}
          <div className="bg-white rounded shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Productos</h2>
            </div>

            {orden.orden_items?.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">
                No hay items en esta orden.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {orden.orden_items?.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4 items-center">
                    {/* Imagen del producto */}
                    <div className="w-14 h-16 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                      {item.productos?.imagenes?.[0] && (
                        <img
                          src={item.productos.imagenes[0]}
                          alt={item.productos.nombre}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Info del producto */}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.productos?.nombre || "Producto eliminado"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.talla && `Talla: ${item.talla}`}
                        {item.talla && item.color && " · "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>

                    {/* Precio */}
                    <p className="text-sm font-semibold text-gray-900">
                      $
                      {(
                        Number(item.precio_unitario) * item.cantidad
                      ).toLocaleString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Total de la orden */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ${Number(orden.total).toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        </div>

        {/* Columna lateral — cliente y acciones */}
        <div className="space-y-6">
          {/* Info del cliente */}
          <div className="bg-white rounded shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Cliente</h2>
            <p className="text-sm text-gray-700">
              {orden.perfiles?.nombre || "Cliente"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ID: {orden.usuario_id?.slice(0, 8)}...
            </p>
          </div>

          {/* Cambiar estado — componente cliente interactivo */}
          <CambiarEstadoOrden ordenId={orden.id} estadoActual={orden.estado} />
        </div>
      </div>
    </div>
  );
}
