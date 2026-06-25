"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters({ categorias, tallas = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActual = searchParams.get("categoria") || "todas";
  const tallaActual = searchParams.get("talla") || "";
  const ordenActual = searchParams.get("orden") || "recientes";

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "todas") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mb-10 space-y-4">
      {/* Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setParam("categoria", "todas")}
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
            onClick={() => setParam("categoria", cat.slug)}
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

      {/* Limpiar filtros */}
      {(categoriaActual !== "todas" || tallaActual) && (
        <div>
          <button
            onClick={() => router.push("/products")}
            className="text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2"
          >
            × Limpiar filtros
          </button>
        </div>
      )}

      {/* Tallas + Orden en la misma fila */}
      <div className="flex flex-wrap gap-3 items-center">
        {tallas.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Talla:</span>
            {tallas.map((t) => (
              <button
                key={t.id}
                onClick={() => setParam("talla", tallaActual === t.nombre ? "" : t.nombre)}
                className={`w-9 h-9 text-xs border transition-colors font-medium ${
                  tallaActual === t.nombre
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-300 hover:border-black"
                }`}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        )}

        <select
          value={ordenActual}
          onChange={(e) => setParam("orden", e.target.value)}
          className="ml-auto border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
        >
          <option value="recientes">Más recientes</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  );
}
