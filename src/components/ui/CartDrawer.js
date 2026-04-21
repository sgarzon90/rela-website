"use client"

import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function CartDrawer() {
  // Obtenemos todo lo que necesitamos del carrito
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total } = useCart()

  return (
    <>
      {/* Fondo oscuro detrás del drawer — al hacer clic cierra el carrito */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel lateral del carrito */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>

        {/* Encabezado del carrito */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold tracking-wide">
            Carrito ({items.length})
          </h2>
          {/* Botón para cerrar el carrito */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-black transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex flex-col h-full">

          {/* Lista de productos — tiene scroll si hay muchos */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

            {/* Si el carrito está vacío mostramos un mensaje */}
            {items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">Tu carrito está vacío</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-sm underline underline-offset-4 text-gray-600 hover:text-black"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              // Recorremos cada producto del carrito
              items.map((item, index) => (
                <div key={index} className="flex gap-4">

                  {/* Imagen del producto */}
                  <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.imagen && (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.nombre}
                    </h3>

                    {/* Talla y color seleccionados */}
                    <p className="text-xs text-gray-400 mt-1">
                      {item.talla && `Talla: ${item.talla}`}
                      {item.talla && item.color && " · "}
                      {item.color && `Color: ${item.color}`}
                    </p>

                    {/* Precio unitario */}
                    <p className="text-sm text-gray-700 mt-1">
                      ${Number(item.precio).toLocaleString("es-CO")}
                    </p>

                    {/* Controles de cantidad y botón eliminar */}
                    <div className="flex items-center justify-between mt-2">

                      {/* Selector de cantidad */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.talla, item.color, item.cantidad - 1)}
                          className="px-3 py-1 text-gray-600 hover:text-black transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm border-x border-gray-200">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.talla, item.color, item.cantidad + 1)}
                          className="px-3 py-1 text-gray-600 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Botón eliminar producto */}
                      <button
                        onClick={() => removeItem(item.id, item.talla, item.color)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Footer del carrito — solo se muestra si hay productos */}
          {items.length > 0 && (
            <div className="px-6 py-6 border-t space-y-4">

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${total.toLocaleString("es-CO")}
                </span>
              </div>

              {/* Botón de checkout */}
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-black text-white text-center py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
              >
                FINALIZAR COMPRA
              </Link>

              {/* Link para seguir comprando */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4"
              >
                Seguir comprando
              </button>

            </div>
          )}

        </div>
      </div>
    </>
  )
}