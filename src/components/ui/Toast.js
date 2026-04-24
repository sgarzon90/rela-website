"use client"

import { useEffect } from "react"

export default function Toast({ mensaje, visible, onClose }) {
  // El toast desaparece automáticamente después de 3 segundos
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  return (
    <div className={`
      fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      bg-black text-white text-sm px-6 py-3
      flex items-center gap-2 shadow-lg
      transition-all duration-300
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
    `}>
      <span className="text-green-400">✓</span>
      {mensaje}
    </div>
  )
}