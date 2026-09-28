"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/context/ToastContext"
import { generarSlug, mensajeErrorProducto } from "@/lib/slug"
import { subirArchivoCloudinary } from "@/lib/cloudinary-upload"

export default function NuevoProducto() {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [subiendoImagenes, setSubiendoImagenes] = useState(0)
  const [imagenes, setImagenes] = useState([])
  const [imagenesPorColor, setImagenesPorColor] = useState({})
  const [categorias, setCategorias] = useState([])
  const [coloresDB, setColoresDB] = useState([])
  const [tallasDB, setTallasDB] = useState([])

  // Variantes: { [colorId_tallaId]: stockValue }
  const [variantes, setVariantes] = useState({})

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_descuento: "",
    categoria_id: "",
    tallaIds: [],    // ids de tallas seleccionadas
    colorIds: [],    // ids de colores seleccionados
    slug: "",
  })

  // Cargar categorías, colores y tallas desde BD
  useEffect(() => {
    const cargar = async () => {
      const [{ data: cats }, { data: cols }, { data: tals }] = await Promise.all([
        supabase.from("categorias").select("*").order("nombre"),
        supabase.from("colores").select("*").order("nombre"),
        supabase.from("tallas").select("*").order("orden"),
      ])
      setCategorias(cats || [])
      setColoresDB(cols || [])
      setTallasDB(tals || [])
    }
    cargar()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === "nombre") {
      setForm((prev) => ({ ...prev, slug: generarSlug(value) }))
    }
  }

  const toggleTalla = (id) => {
    setForm((prev) => {
      const existe = prev.tallaIds.includes(id)
      const nuevosTallas = existe
        ? prev.tallaIds.filter((t) => t !== id)
        : [...prev.tallaIds, id]

      // Si se deselecciona una talla, limpiar variantes que la usen
      if (existe) {
        setVariantes((v) => {
          const nuevo = { ...v }
          Object.keys(nuevo).forEach((k) => {
            if (k.endsWith(`_${id}`)) delete nuevo[k]
          })
          return nuevo
        })
      }

      return { ...prev, tallaIds: nuevosTallas }
    })
  }

  const toggleColor = (id) => {
    setForm((prev) => {
      const existe = prev.colorIds.includes(id)
      const nuevosColores = existe
        ? prev.colorIds.filter((c) => c !== id)
        : [...prev.colorIds, id]

      // Si se deselecciona un color, limpiar variantes que lo usen
      if (existe) {
        setVariantes((v) => {
          const nuevo = { ...v }
          Object.keys(nuevo).forEach((k) => {
            if (k.startsWith(`${id}_`)) delete nuevo[k]
          })
          return nuevo
        })
      }

      return { ...prev, colorIds: nuevosColores }
    })
  }

  const setStock = (colorId, tallaId, valor) => {
    setVariantes((prev) => ({
      ...prev,
      [`${colorId}_${tallaId}`]: valor,
    }))
  }

  // Colores y tallas seleccionados (para la grilla)
  const coloresSeleccionados = coloresDB.filter((c) => form.colorIds.includes(c.id))
  const tallasSeleccionadas = tallasDB.filter((t) => form.tallaIds.includes(t.id))

  const subirImagen = async (e) => {
    const files = Array.from(e.target.files)
    e.target.value = "" // permite volver a elegir el mismo archivo si hay que reintentar
    setSubiendoImagenes((n) => n + 1)
    try {
      for (const file of files) {
        try {
          const url = await subirArchivoCloudinary(file)
          setImagenes((prev) => [...prev, url])
        } catch (err) {
          showToast(err.message)
        }
      }
    } finally {
      setSubiendoImagenes((n) => n - 1)
    }
  }

  const eliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index))
  }

  const subirImagenColor = async (e, colorNombre) => {
    const files = Array.from(e.target.files)
    e.target.value = ""
    setSubiendoImagenes((n) => n + 1)
    try {
      for (const file of files) {
        try {
          const url = await subirArchivoCloudinary(file)
          setImagenesPorColor((prev) => ({
            ...prev,
            [colorNombre]: [...(prev[colorNombre] || []), url],
          }))
        } catch (err) {
          showToast(err.message)
        }
      }
    } finally {
      setSubiendoImagenes((n) => n - 1)
    }
  }

  const eliminarImagenColor = (colorNombre, index) => {
    setImagenesPorColor((prev) => ({
      ...prev,
      [colorNombre]: prev[colorNombre].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return // evita doble envío si el usuario hace doble clic

    if (subiendoImagenes > 0) {
      showToast("Espera a que terminen de subir las imágenes antes de guardar")
      return
    }

    setLoading(true)

    try {
      // 1. Insertar el producto (sin stock global, sin arrays de tallas/colores)
      const { data: producto, error: errorProducto } = await supabase
        .from("productos")
        .insert({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio),
          precio_descuento: form.precio_descuento ? parseFloat(form.precio_descuento) : null,
          categoria_id: parseInt(form.categoria_id),
          // Guardamos los arrays de nombres para compatibilidad con código existente
          tallas: tallasSeleccionadas.map((t) => t.nombre),
          colores: coloresSeleccionados.map((c) => c.nombre),
          // Stock global = suma de todas las variantes
          stock: Object.values(variantes).reduce((s, v) => s + (parseInt(v) || 0), 0),
          slug: form.slug,
          imagenes: imagenes.filter(Boolean),
          imagenes_por_color: imagenesPorColor,
          activo: true,
        })
        .select()
        .single()

      if (errorProducto) {
        showToast("Error al guardar producto: " + mensajeErrorProducto(errorProducto))
        return
      }

      // 2. Insertar variantes
      const variantesArr = []
      for (const colorId of form.colorIds) {
        for (const tallaId of form.tallaIds) {
          const key = `${colorId}_${tallaId}`
          variantesArr.push({
            producto_id: producto.id,
            color_id: colorId,
            talla_id: tallaId,
            stock: parseInt(variantes[key]) || 0,
          })
        }
      }

      if (variantesArr.length > 0) {
        const { error: errorVariantes } = await supabase
          .from("producto_variantes")
          .insert(variantesArr)

        if (errorVariantes) {
          // El producto YA quedó creado en este punto. Si mandamos al usuario
          // de vuelta al formulario de "crear" y reintenta con el mismo
          // nombre, el slug choca con el que acabamos de crear y el error
          // real (que las combinaciones no se guardaron) queda oculto detrás
          // de uno nuevo y más confuso. Por eso lo llevamos a editar el
          // producto que sí se creó, para que solo reintente las variantes.
          showToast("El producto se creó, pero las combinaciones no se guardaron: " + errorVariantes.message)
          router.push(`/admin/productos/${producto.id}`)
          return
        }
      }

      showToast("¡Producto creado exitosamente!")
      router.push("/admin/productos")
    } catch (err) {
      showToast("Error inesperado al guardar: " + (err?.message || "intenta de nuevo"))
    } finally {
      setLoading(false)
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
          />
          <p className="text-xs text-gray-400 mt-1">Se genera automáticamente desde el nombre</p>
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
            rows={8}
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black font-mono"
            placeholder={"Buzo en algodón perchado de 340 g...\n\nCaracterísticas:\n- Algodón perchado de 340 g.\n- RIB 100% algodón."}
          />
          <p className="text-xs text-gray-400 mt-1">
            Deja una línea en blanco para separar párrafos. Para una lista, empieza cada línea con <code className="bg-gray-100 px-1">-</code> (se verá con viñetas en la tienda).
          </p>
        </div>

        {/* Precio */}
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
              placeholder="120000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio con descuento (opcional)
            </label>
            <input
              type="number"
              name="precio_descuento"
              value={form.precio_descuento}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="99000"
            />
          </div>
        </div>

        {/* Categoría — cargada desde BD */}
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
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            ¿No está la categoría?{" "}
            <a href="/admin/configuracion" target="_blank" className="underline">
              Créala en Configuración
            </a>
          </p>
        </div>

        {/* Tallas — cargadas desde BD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tallas disponibles
          </label>
          <div className="flex gap-2 flex-wrap">
            {tallasDB.map((talla) => (
              <button
                key={talla.id}
                type="button"
                onClick={() => toggleTalla(talla.id)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  form.tallaIds.includes(talla.id)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {talla.nombre}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ¿Falta una talla?{" "}
            <a href="/admin/configuracion" target="_blank" className="underline">
              Agrégala en Configuración
            </a>
          </p>
        </div>

        {/* Colores — cargados desde BD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colores disponibles
          </label>
          <div className="flex gap-2 flex-wrap">
            {coloresDB.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => toggleColor(color.id)}
                className={`px-4 py-2 text-sm border transition-colors flex items-center gap-2 ${
                  form.colorIds.includes(color.id)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {color.hex && (
                  <span
                    className="w-3 h-3 rounded-full border border-current inline-block"
                    style={{ backgroundColor: color.hex }}
                  />
                )}
                {color.nombre}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ¿Falta un color?{" "}
            <a href="/admin/configuracion" target="_blank" className="underline">
              Agrégalo en Configuración
            </a>
          </p>
        </div>

        {/* ── GRILLA DE STOCK POR VARIANTE ─────────────────────────────────── */}
        {coloresSeleccionados.length > 0 && tallasSeleccionadas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stock por variante (color × talla)
            </label>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-600 border-b border-r border-gray-200">
                      Color / Talla
                    </th>
                    {tallasSeleccionadas.map((t) => (
                      <th key={t.id} className="px-3 py-2 text-center font-medium text-gray-600 border-b border-gray-200">
                        {t.nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coloresSeleccionados.map((color, ci) => (
                    <tr key={color.id} className={ci % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          {color.hex && (
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300 inline-block flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                          )}
                          {color.nombre}
                        </div>
                      </td>
                      {tallasSeleccionadas.map((talla) => (
                        <td key={talla.id} className="px-2 py-1 text-center">
                          <input
                            type="number"
                            min="0"
                            value={variantes[`${color.id}_${talla.id}`] ?? ""}
                            onChange={(e) => setStock(color.id, talla.id, e.target.value)}
                            className="w-16 border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:border-black"
                            placeholder="0"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Stock total:{" "}
              <strong>
                {Object.values(variantes).reduce((s, v) => s + (parseInt(v) || 0), 0)} unidades
              </strong>
            </p>
          </div>
        )}

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes del producto
          </label>
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
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={subirImagen}
            className="w-full border border-gray-300 px-4 py-2 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Puedes subir varias fotos una por una o eliminar las que no quieras
          </p>
        </div>

        {/* Imágenes por color */}
        {coloresSeleccionados.length > 0 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Imágenes por color{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <p className="text-xs text-gray-400 -mt-2">
              Al seleccionar un color en la tienda, se mostrarán estas imágenes en lugar de las generales.
            </p>
            {coloresSeleccionados.map((color) => (
              <div key={color.id} className="border border-gray-200 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {color.hex && (
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                  )}
                  <p className="text-sm font-medium text-gray-800">{color.nombre}</p>
                </div>
                {(imagenesPorColor[color.nombre] || []).length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {imagenesPorColor[color.nombre].map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`${color.nombre} ${i + 1}`}
                          className="w-full aspect-square object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => eliminarImagenColor(color.nombre, i)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => subirImagenColor(e, color.nombre)}
                  className="w-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600"
                />
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || subiendoImagenes > 0}
          className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : subiendoImagenes > 0 ? "SUBIENDO IMÁGENES..." : "CREAR PRODUCTO"}
        </button>

      </form>
    </div>
  )
}