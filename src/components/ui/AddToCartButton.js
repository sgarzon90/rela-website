"use client"

import { useState } from "react"
// Importamos el hook del carrito para poder agregar productos
import { useCart } from "@/context/CartContext"

export default function AddToCartButton({ product }) {
  // Estado para la talla y color seleccionados por el usuario
  const [selectedTalla, setSelectedTalla] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  // Obtenemos la función para agregar al carrito
  const { addItem } = useCart()

  const handleAddToCart = () => {
    // Validamos que el usuario haya seleccionado talla si el producto tiene tallas
    if (product.tallas?.length > 0 && !selectedTalla) {
      alert("Por favor selecciona una talla")
      return
    }

    // Validamos que el usuario haya seleccionado color si el producto tiene colores
    if (product.colores?.length > 0 && !selectedColor) {
      alert("Por favor selecciona un color")
      return
    }

    // Agregamos el producto al carrito con la talla y color seleccionados
    addItem(product, selectedTalla, selectedColor)
  }

  return (
    <div className="space-y-4">

      {/* Selector de tallas — solo se muestra si el producto tiene tallas */}
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

      {/* Selector de colores — solo se muestra si el producto tiene colores */}
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

      {/* Disponibilidad del producto */}
      <p className="text-sm text-gray-500">
        {product.stock > 0
          ? `${product.stock} unidades disponibles`
          : "Agotado"}
      </p>

      {/* Botón principal — deshabilitado si está agotado */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.stock > 0 ? "AGREGAR AL CARRITO" : "AGOTADO"}
      </button>

    </div>
  )
}