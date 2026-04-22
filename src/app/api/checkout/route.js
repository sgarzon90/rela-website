import { MercadoPagoConfig, Preference } from "mercadopago"
import { createClient } from "@/lib/supabase-server"

// Inicializamos MercadoPago con nuestro access token del servidor
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    // Obtenemos los items del carrito desde el body de la petición
    const { items } = await request.json()

    // Verificamos que haya items en el carrito
    if (!items || items.length === 0) {
      return Response.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      )
    }

    // Verificamos que el usuario esté logueado
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json(
        { error: "Debes iniciar sesión para comprar" },
        { status: 401 }
      )
    }

    // Formateamos los items para MercadoPago
    const mpItems = items.map((item) => ({
      id: String(item.id),
      title: `${item.nombre}${item.talla ? ` - Talla ${item.talla}` : ""}${item.color ? ` - ${item.color}` : ""}`,
      quantity: item.cantidad,
      unit_price: Number(item.precio),
      currency_id: "COP",
    }))

    // Creamos la preferencia de pago en MercadoPago
const preference = await new Preference(mercadopago).create({
  body: {
    items: mpItems,
    // URLs a donde redirige MercadoPago según el resultado del pago
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
    },
    // auto_return solo funciona con URLs públicas, no con localhost
    ...(process.env.NEXT_PUBLIC_APP_URL !== "http://localhost:3000" && {
      auto_return: "approved",
    }),
    metadata: {
      user_id: user.id,
      user_email: user.email,
    },
  },
})

    // Guardamos la orden en nuestra base de datos con estado "pendiente"
    const total = items.reduce(
      (sum, item) => sum + Number(item.precio) * item.cantidad, 0
    )

    await supabase.from("ordenes").insert({
      usuario_id: user.id,
      estado: "pendiente",
      total,
      stripe_payment_id: preference.id, // Reutilizamos este campo para el ID de MercadoPago
    })

    // Devolvemos la URL de pago al frontend
    return Response.json({
      url: preference.sandbox_init_point,
    })

  } catch (error) {
    console.error("Error en checkout:", error)
    return Response.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    )
  }
}