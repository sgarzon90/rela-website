"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export const metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en tu cuenta RELA.",
};

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  // Estado del formulario
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Intentamos iniciar sesión con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      // Mostramos el error en español
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    // Si el login fue exitoso, redirigimos al inicio
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-widest">
            RELA
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-gray-500">Bienvenido de nuevo</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "ENTRANDO..." : "INICIAR SESIÓN"}
          </button>
        </form>

        {/* Link a registro */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/auth/register"
            className="text-black font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
