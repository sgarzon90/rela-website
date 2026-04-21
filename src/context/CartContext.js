"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Cargar carrito guardado al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("rela-cart")
    if (saved) setItems(JSON.parse(saved))
  }, [])

  // Guardar carrito cada vez que cambia
  useEffect(() => {
    localStorage.setItem("rela-cart", JSON.stringify(items))
  }, [items])

  const addItem = (product, talla, color, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.talla === talla &&
          item.color === color
      )

      if (existing) {
        // Si ya existe, aumenta la cantidad
        return prev.map((item) =>
          item.id === product.id && item.talla === talla && item.color === color
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }

      // Si no existe, agrégalo
      return [...prev, {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagenes?.[0] || "",
        slug: product.slug,
        talla,
        color,
        cantidad,
      }]
    })
    setIsOpen(true)
  }

  const removeItem = (id, talla, color) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.talla === talla && item.color === color)
      )
    )
  }

  const updateQuantity = (id, talla, color, cantidad) => {
    if (cantidad < 1) return removeItem(id, talla, color)
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.talla === talla && item.color === color
          ? { ...item, cantidad }
          : item
      )
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce(
    (sum, item) => sum + Number(item.precio) * item.cantidad, 0
  )

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      setIsOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      totalItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)