import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Orders() {
  const supabase = await createClient();

  // Verificamos que el usuario esté logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no está logueado lo mandamos al login
  if (!user) redirect("/auth/login");

  // Traemos las órdenes del usuario ordenadas por fecha
  const { data: ordenes, error } = await supabase
    .from("ordenes")
    .select("*")
    .eq("usuario_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="mb-10">
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          Mi cuenta
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Mis órdenes</h1>
      </div>

      {/* Si no hay órdenes mostramos mensaje */}
      {!ordenes || ordenes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">No tienes órdenes aún.</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm underline underline-offset-4 text-gray-600 hover:text-black"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              className="border border-gray-200 p-6 hover:border-black transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Info de la orden */}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Orden #{orden.id}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(orden.created_at).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Estado y total */}
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      orden.estado === "pagado"
                        ? "bg-green-100 text-green-700"
                        : orden.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {orden.estado}
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-2">
                    ${Number(orden.total).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
