"use client";

import { useState, useEffect } from "react";
import ImageGallery from "@/components/ui/ImageGallery";
import AddToCartButton from "@/components/ui/AddToCartButton";
import FormattedText from "@/components/ui/FormattedText";
import { event as gaEvent } from "@/lib/gtag";

const UMBRAL_ENVIO_GRATIS = 300000;
const LARGO_DESCRIPCION_CORTA = 160;

export default function ProductDetailClient({ producto, stockTotal, variantes }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [descripcionAbierta, setDescripcionAbierta] = useState(false);

  const descripcionLarga = (producto.descripcion?.length || 0) > LARGO_DESCRIPCION_CORTA;

  useEffect(() => {
    const precio = Number(producto.precio_descuento || producto.precio);
    gaEvent("view_item", {
      currency: "COP",
      value: precio,
      items: [{
        item_id: String(producto.id),
        item_name: producto.nombre,
        item_category: producto.categorias?.nombre,
        price: precio,
      }],
    });
    // Solo al entrar a un producto distinto, no en cada re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto.id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ImageGallery
        imagenes={producto.imagenes}
        imagenesPorColor={producto.imagenes_por_color}
        selectedColor={selectedColor}
        nombre={producto.nombre}
      />

      <div className="sticky top-6 space-y-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {producto.categorias?.nombre}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {producto.nombre}
          </h1>
          {producto.precio_descuento ? (
            <div className="mt-3 flex items-center gap-3">
              <p className="text-2xl text-gray-900 font-semibold">
                ${Number(producto.precio_descuento).toLocaleString("es-CO")}
              </p>
              <p className="text-lg text-gray-400 line-through">
                ${Number(producto.precio).toLocaleString("es-CO")}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-2xl text-gray-900">
              ${Number(producto.precio).toLocaleString("es-CO")}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 0h-12" />
            </svg>
            Envío gratis en compras mayores a ${UMBRAL_ENVIO_GRATIS.toLocaleString("es-CO")}
          </p>
        </div>

        {/* Color y talla van antes que la descripción: en móvil son lo primero
            que el usuario debe ver sin necesidad de hacer scroll. */}
        <AddToCartButton
          product={{ ...producto, stock: stockTotal }}
          variantes={variantes}
          onColorChange={setSelectedColor}
        />

        {producto.descripcion && (
          <div>
            <FormattedText
              texto={producto.descripcion}
              className={`text-sm text-gray-600 leading-relaxed ${
                !descripcionAbierta && descripcionLarga ? "line-clamp-3" : ""
              }`}
            />
            {descripcionLarga && (
              <button
                type="button"
                onClick={() => setDescripcionAbierta((v) => !v)}
                className="mt-1.5 text-xs font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
              >
                {descripcionAbierta ? "Ver menos" : "Ver más"}
              </button>
            )}
          </div>
        )}

        {/* Reserva espacio para que el botón fijo "Agregar al carrito" de
            móvil no tape el final del contenido al hacer scroll. Tiene que
            ir aquí, al final de la columna, y no dentro de AddToCartButton
            (que ya no es lo último que se renderiza), o crea un hueco vacío
            en medio de la página en vez de al final. */}
        <div className="md:hidden h-20" />
      </div>
    </div>
  );
}
