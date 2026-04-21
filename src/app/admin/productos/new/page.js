"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NuevoProducto() {
  const [loading, setLoading] = useState(false)
  const [imagenes, setImagenes] = useState([])
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    tallas: [],
    colores: [],
    stock: "",
    slug: "",
  })

  const tallasDisponibles = ["XS", "S", "M", "L", "XL", "XXL"]
  const coloresDisponibles = ["Negro", "Blanco", "Gris", "Azul", "Rojo", "Verde"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Auto-generar slug desde el nombre
    if (name === "nombre") {
      const slug = value.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      setForm((prev) => ({ ...prev, slug }))
    }
  }

  const toggleTalla = (talla) => {
    setForm((prev) => ({
      ...prev,
      tallas: prev.tallas.includes(talla)
        ? prev.tallas.filter((t) => t !== talla)
        : [...prev.tallas, talla],
    }))
  }

  const toggleColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colores: prev.colores.includes(color)
        ? prev.colores.filter((c) => c !== color)
        : [...prev.colores, color],
    }))
  }

  const subirImagen = async (e) => {
    const files = Array.from(e.target.files)

    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )

      const data = await res.json()
      setImagenes((prev) => [...prev, data.secure_url])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("productos").insert({
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      categoria_id: parseInt(form.categoria_id),
      tallas: form.tallas,
      colores: form.colores,
      stock: parseInt(form.stock),
      slug: form.slug,
      imagenes: imagenes,
      activo: true,
    })

    setLoading(false)

    if (error) {
      alert("Error al guardar: " + error.message)
    } else {
      alert("¡Producto creado exitosamente!")
      window.location.href = "/admin/productos"
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del producto
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
            placeholder="Ej: Camiseta Oversize Negra"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL)
          </label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black bg-gray-50"
            placeholder="camiseta-oversize-negra"
          />
          <p className="text-xs text-gray-400 mt-1">
            Se genera automáticamente desde el nombre
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
            placeholder="Describe el producto..."
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio (COP)
            </label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="80000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="10"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
          >
            <option value="">Selecciona una categoría</option>
            <option value="1">Camisetas</option>
            <option value="2">Hoodies</option>
            <option value="3">Pantalones</option>
            <option value="4">Conjuntos</option>
          </select>
        </div>

        {/* Tallas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tallas disponibles
          </label>
          <div className="flex gap-2 flex-wrap">
            {tallasDisponibles.map((talla) => (
              <button
                key={talla}
                type="button"
                onClick={() => toggleTalla(talla)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  form.tallas.includes(talla)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colores disponibles
          </label>
          <div className="flex gap-2 flex-wrap">
            {coloresDisponibles.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  form.colores.includes(color)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes del producto
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={subirImagen}
            className="w-full border border-gray-300 px-4 py-2 text-sm"
          />
          {imagenes.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {imagenes.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Imagen ${i + 1}`}
                  className="w-full aspect-square object-cover border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : "CREAR PRODUCTO"}
        </button>

      </form>
    </div>
  )
}