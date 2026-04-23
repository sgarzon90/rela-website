"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function Register() {
  const router = useRouter();
  const supabase = createClient();

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validamos que las contraseñas coincidan
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // Validamos que la contraseña tenga mínimo 6 caracteres
    if (form.password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    // Registramos el usuario en Supabase
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        // Guardamos el nombre del usuario como metadata
        data: { nombre: form.nombre },
      },
    });

    if (error) {
      setError("Error al crear la cuenta. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    // Redirigimos al inicio después del registro
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo3.png" alt="RELA" className="h-22 w-auto mx-auto" />
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Únete a la comunidad RELA
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="Tu nombre"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
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
            {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
          </button>
        </form>

        {/* Link a login */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-black font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
