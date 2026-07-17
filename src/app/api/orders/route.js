import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  try {
    const { items, total, form, userId } = await request.json();

    if (!items?.length || !total || !form?.nombre || !form?.telefono || !form?.direccion || !form?.ciudad || !form?.departamento) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const { data: orden, error: errorOrden } = await supabaseAdmin
      .from("ordenes")
      .insert({
        usuario_id: userId || null,
        estado: "pendiente",
        total,
        items,
        email: form.email || null,
        nombre_cliente: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
        ciudad: form.ciudad,
        departamento: form.departamento,
        notas: form.notas || null,
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
