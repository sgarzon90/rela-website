"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573160180678"

function buildWhatsAppMessage(items, total, form, ordenId) {
  const lineasProductos = items.map((item) => {
    const detalle = [item.talla && `Talla ${item.talla}`, item.color && item.color].filter(Boolean).join(" · ")
    return `• ${item.nombre}${detalle ? ` (${detalle})` : ""} × ${item.cantidad} — $${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}`
  }).join("\n")

  return `¡Hola RELA! 👋 Quiero hacer el siguiente pedido:

*Pedido #${ordenId}*

📦 *Productos:*
${lineasProductos}

💰 *Total: $${total.toLocaleString("es-CO")}*

📋 *Datos de envío:*
• Nombre: ${form.nombre}
• Teléfono: ${form.telefono}
• Dirección: ${form.direccion}
• Ciudad: ${form.ciudad}
• Departamento: ${form.departamento}${form.notas ? `\n\n📝 *Notas:* ${form.notas}` : ""}`
}

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [exito, setExito] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    notas: "",
  })

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from("ordenes")
      .select("nombre_cliente, telefono, direccion, ciudad, departamento")
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm((prev) => ({
            ...prev,
            nombre: data.nombre_cliente || prev.nombre,
            telefono: data.telefono || prev.telefono,
            direccion: data.direccion || prev.direccion,
            ciudad: data.ciudad || prev.ciudad,
            departamento: data.departamento || prev.departamento,
            email: user.email || prev.email,
          }))
        } else {
          setForm((prev) => ({
            ...prev,
            nombre: user.user_metadata?.nombre || prev.nombre,
            email: user.email || prev.email,
          }))
        }
      })
  }, [user])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()

      // 1. Crear la orden — con timeout de 10s para evitar que se cuelgue
      const rpcPromise = supabase.rpc("crear_orden", {
        p_total: total,
        p_items: items,
        p_nombre_cliente: form.nombre,
        p_telefono: form.telefono,
        p_direccion: form.direccion,
        p_ciudad: form.ciudad,
        p_departamento: form.departamento,
        p_notas: form.notas || null,
      })
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tiempo de espera agotado. Intenta de nuevo.")), 10000)
      )
      const { data: ordenId, error: errorOrden } = await Promise.race([rpcPromise, timeoutPromise])

      if (errorOrden) throw new Error(errorOrden.message)
      const orden = { id: ordenId }

      // 2. Enviar emails de confirmación (no bloquea el checkout)
      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orden.id,
          items,
          total,
          nombre_cliente: form.nombre,
          telefono: form.telefono,
          direccion: form.direccion,
          ciudad: form.ciudad,
          departamento: form.departamento,
          notas: form.notas || null,
          email: form.email || null,
        }),
      }).catch(() => {})

      // 3. Descontar stock (no bloquea el checkout si falla o tarda)
      Promise.race([
        supabase.rpc("descontar_stock_orden", {
          orden_items: items.map((item) => ({
            id: item.id,
            cantidad: item.cantidad,
            color: item.color || null,
            talla: item.talla || null,
          })),
        }),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]).catch(() => {})

      const mensaje = buildWhatsAppMessage(items, total, form, orden.id)
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`

      clearCart()
      setWhatsappUrl(url)
      setExito(true)
      window.open(url, "_blank")
    } catch (err) {
      setError(err.message || "Hubo un error al registrar tu pedido. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm space-y-5">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Inicia sesión para continuar</h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Necesitas una cuenta para finalizar tu pedido. Es rápido y te permite ver el historial de tus órdenes.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login?redirect=/checkout"
              className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors text-center"
            >
              INICIAR SESIÓN
            </Link>
            <Link
              href="/auth/register"
              className="w-full border border-gray-300 text-gray-700 py-3 text-sm font-semibold hover:border-black transition-colors text-center"
            >
              CREAR CUENTA
            </Link>
          </div>
          <Link href="/products" className="text-xs text-gray-400 underline underline-offset-4 hover:text-black transition-colors">
            Seguir comprando
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0 && !exito) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
          <Link href="/products" className="text-sm underline underline-offset-4">
            Ver productos
          </Link>
        </div>
      </main>
    )
  }

  if (exito) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md space-y-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">¡Pedido registrado!</h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Tu pedido quedó guardado. Se abrió WhatsApp para que puedas enviarlo y coordinar el pago y el envío con nosotros.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1ebe5d] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Abrir WhatsApp
          </a>
          <div>
            <Link href="/products" className="text-sm text-gray-400 underline underline-offset-4 hover:text-black transition-colors">
              Seguir comprando
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">Checkout</span>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Finalizar pedido</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Formulario de datos ── */}
        <form onSubmit={handleSubmit} className="space-y-5 order-2 lg:order-1">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Datos de envío
          </h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Juan García"
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@gmail.com"
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Opcional — para enviarte la confirmación del pedido</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono / WhatsApp *</label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              placeholder="3001234567"
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Departamento *</label>
              <input
                type="text"
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
                required
                placeholder="Antioquia"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                required
                placeholder="Medellín"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Dirección completa *</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              placeholder="Cra 45 #80-12 Apto 301"
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notas adicionales</label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
              placeholder="Instrucciones de entrega, horario preferido..."
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              "REGISTRANDO PEDIDO..."
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                ENVIAR PEDIDO POR WHATSAPP
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            Tu pedido queda registrado y se abre WhatsApp para coordinar el pago y envío.
          </p>
        </form>

        {/* ── Resumen del pedido ── */}
        <div className="order-1 lg:order-2">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-5">
            Resumen
          </h2>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={`${item.id}-${item.talla}-${item.color}`} className="flex gap-4 py-4 border-b border-gray-100">
                <div className="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.nombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {[item.talla && `Talla: ${item.talla}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Cantidad: {item.cantidad}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  ${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 py-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${total.toLocaleString("es-CO")}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Envío</span>
              <span>A coordinar por WhatsApp</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-t border-gray-900 mt-2">
            <span className="font-semibold text-gray-900">Total productos</span>
            <span className="text-xl font-bold text-gray-900">${total.toLocaleString("es-CO")}</span>
          </div>
        </div>

      </div>
    </main>
  )
}
