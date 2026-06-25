"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

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
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
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
          <Link href="/">
            <img src="/Logo3.png" alt="RELA" className="h-22 w-auto mx-auto" />
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