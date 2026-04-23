"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"

export default function ResetPassword() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Enviamos el email de restablecimiento de contraseña
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setError("Error al enviar el correo. Intenta de nuevo.")
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-xl font-bold text-gray-900">
            ¡Revisa tu correo!
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Te enviamos un enlace para restablecer tu contraseña a <strong>{email}</strong>.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm underline underline-offset-4"
          >
            Volver al login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-widest">
            RELA
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Restablecer contraseña
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Te enviaremos un enlace a tu correo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="tu@email.com"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "ENVIANDO..." : "ENVIAR ENLACE"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/auth/login" className="text-black font-semibold hover:underline">
            Volver al login
          </Link>
        </p>

      </div>
    </main>
  )
}