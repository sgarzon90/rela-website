// Estados posibles de una orden, en el orden en que avanza un pedido normal.
export const ESTADOS_ORDEN = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];

export const ESTADO_COLORES = {
  pendiente: "bg-yellow-100 text-yellow-700",
  pagado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

export const ESTADO_DESCRIPCION = {
  pendiente: "Recibimos tu pedido y lo estamos procesando.",
  pagado: "¡Pago confirmado! Estamos preparando tu pedido.",
  enviado: "Tu pedido está en camino.",
  entregado: "Tu pedido fue entregado. ¡Gracias por comprar en RELA!",
  cancelado: "Este pedido fue cancelado.",
};
