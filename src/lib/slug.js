// Genera un slug a partir de un nombre de producto.
//
// Antes esto se hacia con `.replace(/[^a-z0-9-]/g, "")`, que simplemente
// BORRABA cualquier letra con tilde o enie (ej: "Algodon" -> "algodn"). Con
// nombres en espanol eso es la norma, no la excepcion, y aumenta mucho el
// riesgo de que dos productos distintos generen el mismo slug -- y
// `productos.slug` tiene una restriccion UNIQUE en la base de datos, asi
// que esa colision hace fallar el guardado con un error confuso.
//
// Aqui primero normalizamos los acentos a su letra base (a con tilde -> a,
// enie -> n, etc.) antes de limpiar el string, asi el slug conserva todas
// las letras en vez de perderlas.
const DIACRITICOS = /[̀-ͯ]/g;

export function generarSlug(nombre) {
  return (nombre || "")
    .normalize("NFD")
    .replace(DIACRITICOS, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Interpreta errores comunes de Postgres/Supabase y devuelve un mensaje
// accionable en espanol, en vez del texto crudo del motor de base de datos.
export function mensajeErrorProducto(error) {
  if (!error) return "";
  if (error.code === "23505" && error.message?.includes("slug")) {
    return "Ya existe un producto con ese nombre (la URL/slug ya esta en uso). Cambia el nombre, edita el slug manualmente, o edita el producto existente en vez de crear uno nuevo.";
  }
  return error.message || "Ocurrio un error inesperado.";
}
