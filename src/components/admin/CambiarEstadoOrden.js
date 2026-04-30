"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"

export default function CambiarEstadoOrden({ ordenId, estadoActual }) {
  const [estado, setEstado] = useState(estadoActual)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Estados disponibles en el flujo de una orden
  const estados = ["pendiente", "pagado", "enviado", "entregado", "cancelado"]

  const handleCambiarEstado = async () => {
    setLoading(true)

    // Actualizamos el estado de la orden en la base de datos
    const { error } = await supabase
      .from("ordenes")
      .update({ estado })
      .eq("id", ordenId)

    if (error) {
      alert("Error al actualizar: " + error.message)
      setLoading(false)
      return
    }

    // Refrescamos la página para mostrar el nuevo estado
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 p-4">
      <h2 className="font-semibold text-gray-900 mb-3">Cambiar estado</h2>

      {/* Selector de estado */}
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black mb-3"
      >
        {estados.map((e) => (
          <option key={e} value={e} className="capitalize">
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </option>
        ))}
      </select>

      {/* Botón para guardar el cambio */}
      <button
        onClick={handleCambiarEstado}
        disabled={loading || estado === estadoActual}
        className="w-full bg-black text-white py-2 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "GUARDANDO..." : "GUARDAR CAMBIO"}
      </button>

      {/* Mensaje si el estado no cambió */}
      {estado === estadoActual && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Este es el estado actual
        </p>
      )}
    </div>
  )
}