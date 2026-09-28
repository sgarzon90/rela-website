// Convierte una descripción escrita en texto plano (con líneas en blanco
// entre párrafos y líneas que empiezan con "-" para listas) en bloques
// listos para renderizar como <p> y <ul><li>.
//
// No usamos un editor de texto enriquecido ni guardamos HTML: el admin
// sigue escribiendo texto simple en un <textarea>, pero con esta convención:
//
//   Un párrafo normal.
//
//   Otro párrafo, separado por una línea en blanco.
//
//   Características:
//   - Primer punto.
//   - Segundo punto.
//
// Al ser texto plano interpretado (no HTML guardado), no hay riesgo de
// inyección de código al mostrarlo.
export function parseDescripcion(texto) {
  const lineas = (texto || "").split(/\r?\n/);
  const bloques = [];
  let actual = null;

  for (const lineaCruda of lineas) {
    const linea = lineaCruda.trim();

    if (!linea) {
      actual = null; // línea en blanco = corta el bloque actual
      continue;
    }

    const esItem = /^[-•]\s+/.test(linea);
    const tipo = esItem ? "lista" : "parrafo";
    const contenido = esItem ? linea.replace(/^[-•]\s+/, "") : linea;

    if (!actual || actual.tipo !== tipo) {
      actual = { tipo, lineas: [] };
      bloques.push(actual);
    }
    actual.lineas.push(contenido);
  }

  return bloques;
}
