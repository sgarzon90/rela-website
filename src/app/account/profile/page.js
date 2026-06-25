import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import EditarPerfil from "@/components/ui/EditarPerfil";
import Link from "next/link";

export const metadata = { title: "Mi perfil — RELA" };

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("nombre")
    .eq("id", user.id)
    .single();

  const { count: totalOrdenes } = await supabase
    .from("ordenes")
    .select("*", { count: "exact", head: true })
    .eq("usuario_id", user.id);

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">Mi cuenta</span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Mi perfil</h1>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 p-5 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalOrdenes || 0}</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Órdenes</p>
        </div>
        <div className="border border-gray-200 p-5 text-center">
          <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Correo</p>
        </div>
      </div>

      {/* Formulario edición */}
      <EditarPerfil nombre={perfil?.nombre || ""} email={user.email} />

      {/* Links adicionales */}
      <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
        <Link href="/account/orders"
          className="flex items-center justify-between px-4 py-3 border border-gray-200 hover:border-black transition-colors text-sm text-gray-700">
          Mis órdenes
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
        <Link href="/auth/reset-password"
          className="flex items-center justify-between px-4 py-3 border border-gray-200 hover:border-black transition-colors text-sm text-gray-700">
          Cambiar contraseña
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
