import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
  try {
    const { items, total, form, userId } = await request.json();

    if (!items?.length || !total || !form?.nombre) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 1. Crear la orden
    const { data: orden, error: errorOrden } = await supabaseAdmin
      .from("ordenes")
      .insert({
        usuario_id: userId || null,
        estado: "pendiente",
        total,
        items,
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

    // 2. Descontar stock por cada item
    for (const item of items) {
      // Descontar stock del producto general
      const { data: producto } = await supabaseAdmin
        .from("productos")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (producto) {
        await supabaseAdmin
          .from("productos")
          .update({ stock: Math.max(0, (producto.stock || 0) - item.cantidad) })
          .eq("id", item.id);
      }

      // Descontar stock de la variante específica (si tiene color y talla)
      if (item.color && item.talla) {
        const [{ data: colorRow }, { data: tallaRow }] = await Promise.all([
          supabaseAdmin.from("colores").select("id").eq("nombre", item.color).single(),
          supabaseAdmin.from("tallas").select("id").eq("nombre", item.talla).single(),
        ]);

        if (colorRow && tallaRow) {
          const { data: variante } = await supabaseAdmin
            .from("producto_variantes")
            .select("id, stock")
            .eq("producto_id", item.id)
            .eq("color_id", colorRow.id)
            .eq("talla_id", tallaRow.id)
            .single();

          if (variante) {
            await supabaseAdmin
              .from("producto_variantes")
              .update({ stock: Math.max(0, (variante.stock || 0) - item.cantidad) })
              .eq("id", variante.id)
              .gte("stock", item.cantidad); // Solo actualiza si hay suficiente stock
          }
        }
      }
    }

    return NextResponse.json({ ordenId: orden.id });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
