"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

export default function UpdatePassword() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  // Estado para saber si la sesión del enlace está lista
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    // Cuando el usuario llega desde el enlace del correo, Supabase
    // envía un evento PASSWORD_RECOVERY que activa la sesión temporalmente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          // La sesión está lista, podemos mostrar el formulario
          setSessionReady(true)
        }
      }
    )

    // También verificamos si ya hay una sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres")
      return
    }

    setLoading(true)

    // Actualizamos la contraseña del usuario
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      // Mostramos el error real para saber qué está pasando
      setError(`Error: ${error.message}`)
      setLoading(false)
      return
    }

    // Cerramos la sesión temporal y mostramos mensaje de éxito
    await supabase.auth.signOut()
    setSuccess(true)
    setLoading(false)
  }

  // Pantalla de éxito
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-900">
            ¡Contraseña actualizada!
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Tu contraseña fue cambiada exitosamente.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            INICIAR SESIÓN
          </Link>
        </div>
      </main>
    )
  }

  // Si la sesión no está lista mostramos mensaje de espera
  if (!sessionReady) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-gray-400 text-sm">Verificando enlace...</p>
          <p className="text-gray-400 text-xs mt-2">
            Si esto tarda mucho,{" "}
            <Link href="/auth/reset-password" className="underline hover:text-black">
              solicita un nuevo enlace
            </Link>
          </p>
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
            Nueva contraseña
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Escribe tu nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "ACTUALIZANDO..." : "ACTUALIZAR CONTRASEÑA"}
          </button>
        </form>

      </div>
    </main>
  )
}