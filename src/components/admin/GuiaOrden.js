"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function GuiaOrden({ ordenId, guiaActual }) {
  const [guia, setGuia] = useState(guiaActual || "")
  const [loading, setLoading] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleGuardar = async (e) => {
    e.preventDefault()
    setLoading(true)
    setGuardado(false)
    try {
      const { error } = await supabase
        .from("ordenes")
        .update({ numero_guia: guia.trim() || null })
        .eq("id", ordenId)

      if (error) throw error

      setGuardado(true)
      router.refresh()
      setTimeout(() => setGuardado(false), 3000)
    } catch (err) {
      alert("Error al guardar: " + (err.message || "Intenta de nuevo"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 p-4">
      <h2 className="font-semibold text-gray-900 mb-1">Número de guía</h2>
      <p className="text-xs text-gray-400 mb-3">El cliente lo verá en su historial de órdenes.</p>

      <form onSubmit={handleGuardar} className="space-y-2">
        <input
          type="text"
          value={guia}
          onChange={(e) => { setGuia(e.target.value); setGuardado(false); }}
          placeholder="Ej: 1234567890"
          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
        <button
          type="submit"
          disabled={loading || guia.trim() === (guiaActual || "")}
          className="w-full bg-black text-white py-2 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "GUARDANDO..." : guardado ? "GUARDADO ✓" : "GUARDAR GUÍA"}
        </button>
      </form>

      {guiaActual && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Guía actual: <span className="font-medium text-gray-600">{guiaActual}</span>
        </p>
      )}
    </div>
  )
}
