"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters({ categorias }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActual = searchParams.get("categoria") || "todas";
  const ordenActual = searchParams.get("orden") || "recientes";

  const handleCategoria = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === "todas") {
      params.delete("categoria");
    } else {
      params.set("categoria", slug);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleOrden = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("orden", e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mb-10 space-y-4">
      {/* Categorías con scroll horizontal en móvil */}
      <div className="relative">
        {/* Categorías con scroll horizontal en móvil */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleCategoria("todas")}
            className={`flex-shrink-0 px-4 py-2 text-sm border transition-colors ${
              categoriaActual === "todas"
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-black"
            }`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoria(cat.slug)}
              className={`flex-shrink-0 px-4 py-2 text-sm border transition-colors ${
                categoriaActual === cat.slug
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300 hover:border-black"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de orden */}
      <select
        value={ordenActual}
        onChange={handleOrden}
        className="w-full md:w-auto border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
      >
        <option value="recientes">Más recientes</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
      </select>
    </div>
  );
}
