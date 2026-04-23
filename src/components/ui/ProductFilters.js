"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function ProductFilters({ categorias }) {
  const router = useRouter()
  // useSearchParams nos permite leer los parámetros actuales de la URL
  const searchParams = useSearchParams()
  const categoriaActual = searchParams.get("categoria") || "todas"
  const ordenActual = searchParams.get("orden") || "recientes"

  const handleCategoria = (slug) => {
    // Construimos la nueva URL con el filtro seleccionado
    const params = new URLSearchParams(searchParams)
    if (slug === "todas") {
      params.delete("categoria")
    } else {
      params.set("categoria", slug)
    }
    router.push(`/products?${params.toString()}`)
  }

  const handleOrden = (e) => {
    const params = new URLSearchParams(searchParams)
    params.set("orden", e.target.value)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">

      {/* Filtros por categoría */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Botón "Todas" */}
        <button
          onClick={() => handleCategoria("todas")}
          className={`px-4 py-2 text-sm border transition-colors ${
            categoriaActual === "todas"
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-300 hover:border-black"
          }`}
        >
          Todas
        </button>

        {/* Botón por cada categoría */}
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoria(cat.slug)}
            className={`px-4 py-2 text-sm border transition-colors ${
              categoriaActual === cat.slug
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-black"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Selector de orden */}
      <select
        value={ordenActual}
        onChange={handleOrden}
        className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
      >
        <option value="recientes">Más recientes</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
      </select>

    </div>
  )
}