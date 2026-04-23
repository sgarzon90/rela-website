"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EditarProducto() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
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
    activo: true,
  })

  const tallasDisponibles = ["XS", "S", "M", "L", "XL", "XXL"]
  const coloresDisponibles = ["Negro", "Blanco", "Gris", "Azul", "Rojo", "Verde"]

  // Cargamos los datos del producto al entrar a la página
  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        alert("Producto no encontrado")
        router.push("/admin/productos")
        return
      }

      // Llenamos el formulario con los datos existentes
      setForm({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        precio: data.precio || "",
        categoria_id: data.categoria_id || "",
        tallas: data.tallas || [],
        colores: data.colores || [],
        stock: data.stock || "",
        slug: data.slug || "",
        activo: data.activo ?? true,
      })
      setImagenes(data.imagenes || [])
      setLoadingData(false)
    }

    fetchProducto()
  }, [id])

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

  const eliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("productos")
      .update({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        categoria_id: parseInt(form.categoria_id),
        tallas: form.tallas,
        colores: form.colores,
        stock: parseInt(form.stock),
        slug: form.slug,
        imagenes: imagenes,
        activo: form.activo,
      })
      .eq("id", id)

    setLoading(false)

    if (error) {
      alert("Error al guardar: " + error.message)
    } else {
      alert("¡Producto actualizado exitosamente!")
      router.push("/admin/productos")
    }
  }

  const handleEliminar = async () => {
    const confirmar = confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")
    if (!confirmar) return

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar: " + error.message)
    } else {
      alert("Producto eliminado")
      router.push("/admin/productos")
    }
  }

  // Mientras cargan los datos mostramos un spinner
  if (loadingData) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-gray-400">Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">

      {/* Encabezado con botón de eliminar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Editar Producto</h1>
        <button
          onClick={handleEliminar}
          className="text-sm text-red-500 hover:text-red-700 transition-colors underline"
        >
          Eliminar producto
        </button>
      </div>

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
          />
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

        {/* Estado activo/inactivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, activo: true }))}
              className={`px-4 py-2 text-sm border transition-colors ${
                form.activo
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black"
              }`}
            >
              Activo
            </button>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, activo: false }))}
              className={`px-4 py-2 text-sm border transition-colors ${
                !form.activo
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black"
              }`}
            >
              Inactivo
            </button>
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes del producto
          </label>

          {/* Imágenes actuales con botón de eliminar */}
          {imagenes.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {imagenes.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    className="w-full aspect-square object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarImagen(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input para subir más imágenes */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={subirImagen}
            className="w-full border border-gray-300 px-4 py-2 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Puedes subir más imágenes o eliminar las existentes
          </p>
        </div>

        {/* Botón guardar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>

      </form>
    </div>
  )
}