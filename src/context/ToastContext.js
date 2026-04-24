"use client"

import { createContext, useContext, useState, useCallback } from "react"
import Toast from "@/components/ui/Toast"

const ToastContext = createContext({})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, mensaje: "" })

  // Función para mostrar el toast desde cualquier componente
  const showToast = useCallback((mensaje) => {
    setToast({ visible: true, mensaje })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* El toast vive aquí para estar disponible en toda la app */}
      <Toast
        mensaje={toast.mensaje}
        visible={toast.visible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)