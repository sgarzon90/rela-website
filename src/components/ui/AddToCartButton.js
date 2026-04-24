"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/context/ToastContext"

export default function AddToCartButton({ product }) {
  const [selectedTalla, setSelectedTalla] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const { addItem } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = () => {
    if (product.tallas?.length > 0 && !selectedTalla) {
      showToast("Por favor selecciona una talla")
      return
    }

    if (product.colores?.length > 0 && !selectedColor) {
      showToast("Por favor selecciona un color")
      return
    }

    addItem(product, selectedTalla, selectedColor)
    showToast(`${product.nombre} agregado al carrito`)
  }

  return (
    <>
      {/* Versión desktop — se muestra normalmente en la página */}
      <div className="hidden md:block space-y-4">

        {/* Selector de tallas */}
        {product.tallas?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Talla</p>
            <div className="flex gap-2 flex-wrap">
              {product.tallas.map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => setSelectedTalla(talla)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedTalla === talla
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selector de colores */}
        {product.colores?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {product.colores.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedColor === color
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disponibilidad */}
        <p className="text-sm text-gray-500">
          {product.stock > 0
            ? `${product.stock} unidades disponibles`
            : "Agotado"}
        </p>

        {/* Botón desktop */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock > 0 ? "AGREGAR AL CARRITO" : "AGOTADO"}
        </button>

      </div>

      {/* Versión móvil — selectores normales + botón sticky abajo */}
      <div className="md:hidden space-y-4">

        {/* Selector de tallas en móvil */}
        {product.tallas?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Talla</p>
            <div className="flex gap-2 flex-wrap">
              {product.tallas.map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => setSelectedTalla(talla)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedTalla === talla
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selector de colores en móvil */}
        {product.colores?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {product.colores.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedColor === color
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disponibilidad */}
        <p className="text-sm text-gray-500">
          {product.stock > 0
            ? `${product.stock} unidades disponibles`
            : "Agotado"}
        </p>

        {/* Espacio para que el botón sticky no tape el contenido */}
        <div className="h-20" />

      </div>

      {/* Botón sticky en móvil — siempre visible en la parte inferior */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock > 0
            ? `AGREGAR — $${Number(product.precio).toLocaleString("es-CO")}`
            : "AGOTADO"}
        </button>
      </div>
    </>
  )
}