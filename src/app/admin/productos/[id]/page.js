"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/context/ToastContext"

export default function EditarProducto() {
  const { id } = useParams()
  const router = useRouter()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [imagenes, setImagenes] = useState([])
  const [imagenesPorColor, setImagenesPorColor] = useState({})
  const [categorias, setCategorias] = useState([])
  const [coloresDB, setColoresDB] = useState([])
  const [tallasDB, setTallasDB] = useState([])
  const [variantes, setVariantes] = useState({})

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_descuento: "",
    categoria_id: "",
    tallaIds: [],
    colorIds: [],
    slug: "",
    activo: true,
  })

  useEffect(() => {
    const cargar = async () => {
      const [
        { data: cats },
        { data: cols },
        { data: tals },
        { data: producto },
        { data: variantesData },
      ] = await Promise.all([
        supabase.from("categorias").select("*").order("nombre"),
        supabase.from("colores").select("*").order("nombre"),
        supabase.from("tallas").select("*").order("orden"),
        supabase.from("productos").select("*").eq("id", id).single(),
        supabase.from("producto_variantes").select("color_id, talla_id, stock").eq("producto_id", id),
      ])

      setCategorias(cats || [])
      setColoresDB(cols || [])
      setTallasDB(tals || [])

      if (!producto) {
        showToast("Producto no encontrado")
        router.push("/admin/productos")
        return
      }

      const colorIds = [...new Set(variantesData?.map((v) => v.color_id).filter(Boolean) || [])]
      const tallaIds = [...new Set(variantesData?.map((v) => v.talla_id).filter(Boolean) || [])]

      const variantesMap = {}
      variantesData?.forEach((v) => {
        if (v.color_id && v.talla_id) variantesMap[`${v.color_id}_${v.talla_id}`] = String(v.stock)
      })

      setForm({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || "",
        precio_descuento: producto.precio_descuento || "",
        categoria_id: producto.categoria_id || "",
        tallaIds,
        colorIds,
        slug: producto.slug || "",
        activo: producto.activo ?? true,
      })
      setImagenes(producto.imagenes || [])
      setImagenesPorColor(producto.imagenes_por_color || {})
      setVariantes(variantesMap)
      setLoadingData(false)
    }
    cargar()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === "nombre") {
      setForm((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }))
    }
  }

  const toggleColor = (colorId) => {
    setForm((prev) => {
      const existe = prev.colorIds.includes(colorId)
      if (existe) {
        setVariantes((v) => {
          const nuevo = { ...v }
          Object.keys(nuevo).forEach((k) => { if (k.startsWith(`${colorId}_`)) delete nuevo[k] })
          return nuevo
        })
      }
      return { ...prev, colorIds: existe ? prev.colorIds.filter((c) => c !== colorId) : [...prev.colorIds, colorId] }
    })
  }

  const toggleTalla = (tallaId) => {
    setForm((prev) => {
      const existe = prev.tallaIds.includes(tallaId)
      if (existe) {
        setVariantes((v) => {
          const nuevo = { ...v }
          Object.keys(nuevo).forEach((k) => { if (k.endsWith(`_${tallaId}`)) delete nuevo[k] })
          return nuevo
        })
      }
      return { ...prev, tallaIds: existe ? prev.tallaIds.filter((t) => t !== tallaId) : [...prev.tallaIds, tallaId] }
    })
  }

  const setStock = (colorId, tallaId, valor) => {
    setVariantes((prev) => ({ ...prev, [`${colorId}_${tallaId}`]: valor }))
  }

  const subirImagen = async (e) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData })
      const data = await res.json()
      setImagenes((prev) => [...prev, data.secure_url])
    }
  }

  const eliminarImagen = (index) => setImagenes((prev) => prev.filter((_, i) => i !== index))

  const subirImagenColor = async (e, colorNombre) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData })
      const data = await res.json()
      setImagenesPorColor((prev) => ({ ...prev, [colorNombre]: [...(prev[colorNombre] || []), data.secure_url] }))
    }
  }

  const eliminarImagenColor = (colorNombre, index) => {
    setImagenesPorColor((prev) => ({ ...prev, [colorNombre]: prev[colorNombre].filter((_, i) => i !== index) }))
  }

  const coloresSeleccionados = coloresDB.filter((c) => form.colorIds.includes(c.id))
  const tallasSeleccionadas = tallasDB.filter((t) => form.tallaIds.includes(t.id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error: errorProducto } = await supabase
      .from("productos")
      .update({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        precio_descuento: form.precio_descuento ? parseFloat(form.precio_descuento) : null,
        categoria_id: parseInt(form.categoria_id),
        tallas: tallasSeleccionadas.map((t) => t.nombre),
        colores: coloresSeleccionados.map((c) => c.nombre),
        stock: Object.values(variantes).reduce((s, v) => s + (parseInt(v) || 0), 0),
        slug: form.slug,
        imagenes,
        imagenes_por_color: imagenesPorColor,
        activo: form.activo,
      })
      .eq("id", id)

    if (errorProducto) {
      showToast("Error al guardar: " + errorProducto.message)
      setLoading(false)
      return
    }

    await supabase.from("producto_variantes").delete().eq("producto_id", id)

    const variantesArr = []
    for (const colorId of form.colorIds) {
      for (const tallaId of form.tallaIds) {
        variantesArr.push({
          producto_id: id,
          color_id: colorId,
          talla_id: tallaId,
          stock: parseInt(variantes[`${colorId}_${tallaId}`]) || 0,
        })
      }
    }

    if (variantesArr.length > 0) {
      const { error: errorVariantes } = await supabase.from("producto_variantes").insert(variantesArr)
      if (errorVariantes) {
        showToast("Producto guardado pero error en variantes")
        setLoading(false)
        return
      }
    }

    showToast("¡Producto actualizado!")
    setLoading(false)
    router.push("/admin/productos")
  }

  const handleEliminar = async () => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return

    const { error } = await supabase.from("productos").delete().eq("id", id)
    if (error) {
      showToast("Error al eliminar: " + error.message)
    } else {
      showToast("Producto eliminado")
      router.push("/admin/productos")
    }
  }

  if (loadingData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-400 text-sm">Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Editar Producto</h1>
        <button onClick={handleEliminar} className="text-sm text-red-500 hover:text-red-700 transition-colors underline">
          Eliminar producto
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black" />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
          <input type="text" name="slug" value={form.slug} onChange={handleChange} required
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black bg-gray-50" />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4}
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black" />
        </div>

        {/* Precios */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} required
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio con descuento</label>
            <input type="number" name="precio_descuento" value={form.precio_descuento} onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black" placeholder="Opcional" />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select name="categoria_id" value={form.categoria_id} onChange={handleChange} required
            className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black">
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Tallas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tallas disponibles</label>
          <div className="flex gap-2 flex-wrap">
            {tallasDB.map((talla) => (
              <button key={talla.id} type="button" onClick={() => toggleTalla(talla.id)}
                className={`px-4 py-2 text-sm border transition-colors ${form.tallaIds.includes(talla.id) ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black"}`}>
                {talla.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Colores disponibles</label>
          <div className="flex gap-2 flex-wrap">
            {coloresDB.map((color) => (
              <button key={color.id} type="button" onClick={() => toggleColor(color.id)}
                className={`px-4 py-2 text-sm border transition-colors flex items-center gap-2 ${form.colorIds.includes(color.id) ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black"}`}>
                {color.hex && <span className="w-3 h-3 rounded-full border border-current" style={{ backgroundColor: color.hex }} />}
                {color.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de stock */}
        {coloresSeleccionados.length > 0 && tallasSeleccionadas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Stock por variante (color × talla)</label>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-600 border-b border-r border-gray-200">Color / Talla</th>
                    {tallasSeleccionadas.map((t) => (
                      <th key={t.id} className="px-3 py-2 text-center font-medium text-gray-600 border-b border-gray-200">{t.nombre}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coloresSeleccionados.map((color, ci) => (
                    <tr key={color.id} className={ci % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          {color.hex && <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: color.hex }} />}
                          {color.nombre}
                        </div>
                      </td>
                      {tallasSeleccionadas.map((talla) => (
                        <td key={talla.id} className="px-2 py-1 text-center">
                          <input type="number" min="0"
                            value={variantes[`${color.id}_${talla.id}`] ?? ""}
                            onChange={(e) => setStock(color.id, talla.id, e.target.value)}
                            className="w-16 border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:border-black"
                            placeholder="0" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Stock total: <strong>{Object.values(variantes).reduce((s, v) => s + (parseInt(v) || 0), 0)} unidades</strong>
            </p>
          </div>
        )}

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, activo: true }))}
              className={`px-4 py-2 text-sm border transition-colors ${form.activo ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300 hover:border-black"}`}>
              Activo
            </button>
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, activo: false }))}
              className={`px-4 py-2 text-sm border transition-colors ${!form.activo ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-300 hover:border-black"}`}>
              Inactivo
            </button>
          </div>
        </div>

        {/* Imágenes generales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del producto</label>
          {imagenes.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {imagenes.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`Imagen ${i + 1}`} className="w-full aspect-square object-cover border" />
                  <button type="button" onClick={() => eliminarImagen(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-700">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <input type="file" accept="image/*" multiple onChange={subirImagen}
            className="w-full border border-gray-300 px-4 py-2 text-sm" />
        </div>

        {/* Imágenes por color */}
        {coloresSeleccionados.length > 0 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Imágenes por color <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <p className="text-xs text-gray-400 -mt-2">Al seleccionar un color en la tienda, se mostrarán estas imágenes.</p>
            {coloresSeleccionados.map((color) => (
              <div key={color.id} className="border border-gray-200 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {color.hex && <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: color.hex }} />}
                  <p className="text-sm font-medium text-gray-800">{color.nombre}</p>
                </div>
                {(imagenesPorColor[color.nombre] || []).length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {imagenesPorColor[color.nombre].map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt={`${color.nombre} ${i + 1}`} className="w-full aspect-square object-cover border" />
                        <button type="button" onClick={() => eliminarImagenColor(color.nombre, i)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-700">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" accept="image/*" multiple onChange={(e) => subirImagenColor(e, color.nombre)}
                  className="w-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600" />
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>
      </form>
    </div>
  )
}
