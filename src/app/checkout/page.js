"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Si no hay items redirigimos al carrito
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500">Tu carrito está vacío</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm underline underline-offset-4"
          >
            Ver productos
          </Link>
        </div>
      </main>
    )
  }

  // Si no está logueado lo mandamos al login
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Debes iniciar sesión para continuar
          </p>
          <Link
            href="/auth/login"
            className="bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            INICIAR SESIÓN
          </Link>
        </div>
      </main>
    )
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError("")

    try {
      // Enviamos los items al servidor para crear la preferencia de pago
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al procesar el pago")
        setLoading(false)
        return
      }

      // Limpiamos el carrito y redirigimos a MercadoPago
      clearCart()
      window.location.href = data.url

    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Resumen de tu orden</h1>

      {/* Lista de productos */}
      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 py-4 border-b border-gray-100">

            {/* Imagen */}
            <div className="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{item.nombre}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {item.talla && `Talla: ${item.talla}`}
                {item.talla && item.color && " · "}
                {item.color && `Color: ${item.color}`}
              </p>
              <p className="text-xs text-gray-400">
                Cantidad: {item.cantidad}
              </p>
            </div>

            {/* Precio */}
            <p className="text-sm font-semibold">
              ${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}
            </p>

          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-8">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold">
          ${total.toLocaleString("es-CO")}
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {/* Botón de pago */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? "PROCESANDO..." : "PAGAR CON MERCADOPAGO"}
      </button>

      <p className="mt-4 text-xs text-center text-gray-400">
        Serás redirigido a MercadoPago para completar tu pago de forma segura.
      </p>

    </main>
  )
}