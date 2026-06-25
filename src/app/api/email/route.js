import { NextResponse } from "next/server"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "soporte.rela@gmail.com"
const FROM_EMAIL = process.env.FROM_EMAIL || "RELA <noreply@rela.com>"

function buildClienteHtml(orden) {
  const lineas = orden.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <strong>${item.nombre}</strong>
          ${item.talla || item.color ? `<br/><span style="color:#888;font-size:13px;">${[item.talla && `Talla: ${item.talla}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}</span>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:center;color:#888;">${item.cantidad}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;">$${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}</td>
      </tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 20px;">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ebebeb;">

        <!-- Header -->
        <tr>
          <td style="background:#000;padding:28px 40px;text-align:center;">
            <span style="color:#fff;font-size:24px;font-weight:bold;letter-spacing:6px;">RELA</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#111;">¡Pedido recibido!</h1>
            <p style="margin:0 0 24px;color:#666;font-size:14px;">Hola ${orden.nombre_cliente}, tu pedido <strong>#${orden.id}</strong> quedó registrado. Nos pondremos en contacto contigo por WhatsApp para coordinar el pago y el envío.</p>

            <!-- Productos -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <thead>
                <tr style="border-bottom:2px solid #111;">
                  <th style="padding:8px 0;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#444;">Producto</th>
                  <th style="padding:8px 0;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#444;">Cant.</th>
                  <th style="padding:8px 0;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#444;">Precio</th>
                </tr>
              </thead>
              <tbody>${lineas}</tbody>
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #111;margin-bottom:32px;">
              <tr>
                <td style="padding:12px 0;font-weight:700;font-size:16px;">Total</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;font-size:16px;">$${Number(orden.total).toLocaleString("es-CO")}</td>
              </tr>
            </table>

            <!-- Datos de envío -->
            <div style="background:#f9f9f9;padding:20px;margin-bottom:32px;">
              <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;">Datos de envío</p>
              <p style="margin:0;font-size:14px;color:#333;line-height:1.8;">
                ${orden.nombre_cliente}<br/>
                ${orden.telefono}<br/>
                ${orden.direccion}<br/>
                ${orden.ciudad}, ${orden.departamento}
                ${orden.notas ? `<br/><em style="color:#888;">Notas: ${orden.notas}</em>` : ""}
              </p>
            </div>

            <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">Si tienes alguna duda escríbenos por WhatsApp o a <a href="mailto:${ADMIN_EMAIL}" style="color:#000;">${ADMIN_EMAIL}</a>.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f5f5;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">© ${new Date().getFullYear()} RELA. Todos los derechos reservados.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildAdminHtml(orden) {
  const lineas = orden.items
    .map(
      (item) =>
        `• ${item.nombre}${item.talla ? ` | Talla: ${item.talla}` : ""}${item.color ? ` | Color: ${item.color}` : ""} × ${item.cantidad} — $${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}`
    )
    .join("<br/>")

  return `<h2>Nuevo pedido #${orden.id}</h2>
<p><strong>Cliente:</strong> ${orden.nombre_cliente}<br/>
<strong>Teléfono:</strong> ${orden.telefono}<br/>
<strong>Dirección:</strong> ${orden.direccion}, ${orden.ciudad}, ${orden.departamento}</p>
<p><strong>Productos:</strong><br/>${lineas}</p>
<p><strong>Total: $${Number(orden.total).toLocaleString("es-CO")}</strong></p>
${orden.notas ? `<p><strong>Notas:</strong> ${orden.notas}</p>` : ""}`
}

export async function POST(request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY no configurado" }, { status: 500 })
  }

  try {
    const orden = await request.json()

    const emails = []

    // Email al cliente (si tiene correo)
    if (orden.email) {
      emails.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [orden.email],
            subject: `Pedido #${orden.id} recibido — RELA`,
            html: buildClienteHtml(orden),
          }),
        })
      )
    }

    // Notificación al admin
    emails.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          subject: `Nuevo pedido #${orden.id} — ${orden.nombre_cliente}`,
          html: buildAdminHtml(orden),
        }),
      })
    )

    await Promise.allSettled(emails)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
