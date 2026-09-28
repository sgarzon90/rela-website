import { Fragment } from "react";
import { parseDescripcion } from "@/lib/formatted-text";

// Renderiza una descripción de producto con párrafos y listas, a partir de
// texto plano escrito con la convención descrita en lib/formatted-text.js.
export default function FormattedText({ texto, className = "" }) {
  const bloques = parseDescripcion(texto);
  if (bloques.length === 0) return null;

  return (
    <div className={className}>
      {bloques.map((bloque, i) =>
        bloque.tipo === "lista" ? (
          <ul key={i} className="list-disc pl-5 space-y-1 my-3 first:mt-0 last:mb-0">
            {bloque.lineas.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i} className="my-3 first:mt-0 last:mb-0">
            {bloque.lineas.map((linea, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {linea}
              </Fragment>
            ))}
          </p>
        )
      )}
    </div>
  );
}
