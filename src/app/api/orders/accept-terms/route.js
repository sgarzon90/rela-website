import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { TERMINOS_VERSION } from "@/lib/legal-version"

// Deja constancia de cuándo se aceptaron los Términos/Privacidad para un
// pedido creado por un usuario con sesión (ese flujo pasa por la función
// `crear_orden` de Supabase, que no toca este repo, así que lo registramos
// aquí mismo justo después). El pedido de invitado ya lo registra
// directamente /api/orders al crearlo.
export async function POST(request) {
  try {
    const { ordenId } = await request.json()
    const id = parseInt(ordenId)
    if (!id) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    await supabaseAdmin
      .from("ordenes")
      .update({
        terminos_aceptados_en: new Date().toISOString(),
        terminos_version: TERMINOS_VERSION,
      })
      .eq("id", id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
