"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mapa de respaldo para pintar el swatch cuando el color no tiene foto propia
const COLOR_HEX = {
  negro: "#111111",
  blanco: "#f5f5f5",
  gris: "#9ca3af",
  "gris claro": "#d1d5db",
  "gris oscuro": "#4b5563",
  azul: "#2563eb",
  "azul oscuro": "#1e3a8a",
  "azul claro": "#60a5fa",
  rojo: "#dc2626",
  verde: "#16a34a",
  beige: "#e8dcc8",
  café: "#7c4a2d",
  marron: "#7c4a2d",
  marrón: "#7c4a2d",
  rosado: "#f9a8d4",
  rosa: "#f9a8d4",
  amarillo: "#facc15",
  morado: "#7c3aed",
  violeta: "#7c3aed",
  naranja: "#f97316",
  vino: "#7f1d1d",
  crema: "#f5f0e1",
  arena: "#d9c9a3",
  khaki: "#a3925a",
  oliva: "#5f6b3a",
};

export default function ProductCard({ product }) {
  const [previewColor, setPreviewColor] = useState(null);

  const categoria = product.categorias?.nombre || product.categoria || "";
  const tieneDescuento = product.precio_descuento && Number(product.precio_descuento) < Number(product.precio);
  const colores = product.colores || [];
  const imagenesPorColor = product.imagenes_por_color || {};

  // product.stock es la suma de todas las variantes (se recalcula en el admin
  // cada vez que se edita el inventario), así que es confiable para el listado.
  const hayStockInfo = typeof product.stock === "number";
  const agotado = hayStockInfo && product.stock === 0;
  const pocasUnidades = hayStockInfo && product.stock > 0 && product.stock <= 5;

  const imagen =
    (previewColor && imagenesPorColor[previewColor]?.[0]) || product.imagenes?.[0];

  const href = `/products/${product.slug}`;

  return (
    <div className="group">
      <div className="bg-gray-100 aspect-[3/4] overflow-hidden relative">
        <Link href={href} className="absolute inset-0 block" aria-label={product.nombre}>
          {imagen ? (
            <Image
              src={imagen}
              alt={product.nombre}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover transition-transform duration-700 ${
                agotado ? "opacity-50 grayscale-[40%]" : "group-hover:scale-105"
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} className="text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </Link>

        {agotado ? (
          <span className="absolute top-2 left-2 bg-gray-900/85 text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider z-10 pointer-events-none">
            AGOTADO
          </span>
        ) : (
          tieneDescuento && (
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider z-10 pointer-events-none">
              OFERTA
            </span>
          )
        )}

        {pocasUnidades && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider z-10 pointer-events-none rounded-sm">
            ¡Últimas {product.stock}!
          </span>
        )}

        {/* Swatches de color — visibles sobre la foto para que se note que hay más opciones */}
        {colores.length > 1 && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5">
            {colores.slice(0, 4).map((nombre) => {
              const thumb = imagenesPorColor[nombre]?.[0];
              const activo = previewColor === nombre;
              return (
                <button
                  key={nombre}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPreviewColor(nombre);
                  }}
                  title={nombre}
                  aria-label={`Ver en color ${nombre}`}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 shadow-sm transition-transform ${
                    activo ? "border-black scale-110" : "border-white hover:scale-105"
                  }`}
                  style={!thumb ? { backgroundColor: COLOR_HEX[nombre?.toLowerCase()] || "#d1d5db" } : undefined}
                >
                  {thumb && (
                    // Thumbnail pequeño: <img> plano evita la sobrecarga de next/image para un ícono de 24px
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              );
            })}
            {colores.length > 4 && (
              <span className="w-7 h-7 rounded-full bg-white/90 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-semibold text-gray-700">
                +{colores.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <Link href={href} className="block mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest">{categoria}</p>
        <h3 className="mt-1 text-sm font-serif font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.nombre}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm text-gray-900">
            ${Number(tieneDescuento ? product.precio_descuento : product.precio).toLocaleString("es-CO")}
          </p>
          {tieneDescuento && (
            <p className="text-xs text-gray-400 line-through">
              ${Number(product.precio).toLocaleString("es-CO")}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
