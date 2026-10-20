import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { TERMINOS_VERSION } from "@/lib/legal-version"

// Deja constancia de cuándo una cuenta nueva aceptó los Términos y la
// Política de privacidad. Se llama justo después de que el registro en
// Supabase Auth sea exitoso (la fila en `perfiles` ya existe para ese
// momento, la crea un trigger al insertarse el usuario en auth.users).
export async function POST(request) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    await supabaseAdmin
      .from("perfiles")
      .update({
        terminos_aceptados_en: new Date().toISOString(),
        terminos_version: TERMINOS_VERSION,
      })
      .eq("id", userId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
