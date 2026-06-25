"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    // Si el login fue exitoso, redirigimos al redirect o al inicio
    const redirect = searchParams.get("redirect") || "/"
    router.push(redirect);
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/Logo3.png" alt="RELA" className="h-22 w-auto mx-auto" />
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Link
                href="/auth/reset-password"
                className="text-xs text-gray-400 hover:text-black transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
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
