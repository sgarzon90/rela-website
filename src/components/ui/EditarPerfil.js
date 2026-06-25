"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function EditarPerfil({ nombre: nombreInicial, email }) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { error } = await supabase
        .from("perfiles")
        .update({ nombre: nombre.trim() })
        .eq("id", user.id);

      if (error) throw error;

      await supabase.auth.updateUser({ data: { nombre: nombre.trim() } });

      setMsg({ texto: "Perfil actualizado correctamente.", ok: true });
      router.refresh();
    } catch (err) {
      setMsg({ texto: "Error al guardar: " + (err.message || "Intenta de nuevo"), ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Editar información</h2>

      <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Correo electrónico</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400 mt-1">El correo no se puede cambiar desde aquí.</p>
      </div>

      {msg && (
        <p className={`text-sm font-medium ${msg.ok ? "text-green-600" : "text-red-500"}`}>
          {msg.texto}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || nombre.trim() === nombreInicial}
        className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
      </button>
    </form>
  );
}
