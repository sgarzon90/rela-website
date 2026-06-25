"use client";

import { useState } from "react";
import ImageGallery from "@/components/ui/ImageGallery";
import AddToCartButton from "@/components/ui/AddToCartButton";

export default function ProductDetailClient({ producto, stockTotal, variantes }) {
  const [selectedColor, setSelectedColor] = useState("");

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
        </div>

        {producto.descripcion && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {producto.descripcion}
          </p>
        )}

        <AddToCartButton
          product={{ ...producto, stock: stockTotal }}
          variantes={variantes}
          onColorChange={setSelectedColor}
        />
      </div>
    </div>
  );
}
