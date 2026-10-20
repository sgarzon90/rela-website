import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { TERMINOS_VERSION } from "@/lib/legal-version";

const MAX_TEXTO = 300;
const MAX_ITEMS = 50;
const VENTANA_DUPLICADO_SEGUNDOS = 30;

export async function POST(request) {
  try {
    const { items, total, form, userId } = await request.json();

    // Honeypot: un bot que llena el formulario a ciegas suele completar
    // este campo oculto, que ninguna persona ve ni llena. Lo rechazamos
    // igual que cualquier otro dato inválido — así no hay dos códigos de
    // respuesta distintos que un bot pueda usar para aprender a evadirlo,
    // y tampoco arriesgamos fingir un "éxito" que en realidad no guardó
    // nada si algún navegador llega a autocompletar el campo por error.
    if (
      form?.referencia_extra ||
      !items?.length ||
      items.length > MAX_ITEMS ||
      !total ||
      !Number.isFinite(Number(total)) ||
      Number(total) <= 0 ||
      !form?.nombre?.trim() ||
      !form?.telefono?.trim() ||
      !form?.direccion?.trim() ||
      !form?.ciudad?.trim() ||
      !form?.departamento?.trim() ||
      !form?.aceptaTerminos
    ) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const telefono = form.telefono.trim().slice(0, 30);
    if (telefono.replace(/\D/g, "").length < 7) {
      return NextResponse.json({ error: "Teléfono inválido" }, { status: 400 });
    }

    // Freno básico anti-ráfaga: si ya se registró un pedido con este mismo
    // teléfono en los últimos segundos, lo rechazamos (típico de un bot
    // reenviando el mismo formulario varias veces seguidas).
    const desde = new Date(Date.now() - VENTANA_DUPLICADO_SEGUNDOS * 1000).toISOString();
    const { data: reciente } = await supabaseAdmin
      .from("ordenes")
      .select("id")
      .eq("telefono", telefono)
      .gte("created_at", desde)
      .limit(1);

    if (reciente?.length) {
      return NextResponse.json({ error: "Ya registramos un pedido con estos datos hace un momento" }, { status: 429 });
    }

    const { data: orden, error: errorOrden } = await supabaseAdmin
      .from("ordenes")
      .insert({
        usuario_id: userId || null,
        estado: "pendiente",
        total: Number(total),
        items,
        email: form.email?.trim().slice(0, 200) || null,
        nombre_cliente: form.nombre.trim().slice(0, MAX_TEXTO),
        telefono,
        direccion: form.direccion.trim().slice(0, MAX_TEXTO),
        ciudad: form.ciudad.trim().slice(0, 100),
        departamento: form.departamento.trim().slice(0, 100),
        notas: form.notas?.trim().slice(0, MAX_TEXTO) || null,
        // El checkbox del formulario ya exige marcar la casilla para poder
        // enviar; aquí volvemos a validarlo (arriba) y dejamos constancia
        // de cuándo y qué versión de los Términos/Privacidad se aceptó.
        terminos_aceptados_en: new Date().toISOString(),
        terminos_version: TERMINOS_VERSION,
      })
      .select("id")
      .single();

    if (errorOrden) {
      return NextResponse.json({ error: errorOrden.message }, { status: 500 });
    }

    // Descontar stock con la misma función RPC que usa el flujo con sesión
    // (no bloquea la respuesta si falla o tarda demasiado)
    await Promise.race([
      supabaseAdmin.rpc("descontar_stock_orden", {
        orden_items: items.map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
          color: item.color || null,
          talla: item.talla || null,
        })),
      }),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]).catch(() => {});

    return NextResponse.json({ ordenId: orden.id });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
