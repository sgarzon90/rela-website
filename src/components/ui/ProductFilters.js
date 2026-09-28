"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OPCIONES_ORDEN = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

export default function ProductFilters({ categorias, tallas = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActual = searchParams.get("categoria") || "todas";
  const tallaActual = searchParams.get("talla") || "";
  const ordenActual = searchParams.get("orden") || "recientes";
  const [sheetAbierto, setSheetAbierto] = useState(false);

  // Bloquear scroll del body mientras el sheet de filtros está abierto (móvil)
  useEffect(() => {
    document.body.style.overflow = sheetAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetAbierto]);

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "todas") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  // Cuántos filtros "extra" (aparte de categoría) están activos, para el badge del botón móvil
  const filtrosActivos = (tallaActual ? 1 : 0) + (ordenActual !== "recientes" ? 1 : 0);

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

      {/* Tallas + Orden — inline en desktop, detrás de un botón "Filtrar y ordenar" en móvil
          para no saturar la pantalla chica con varias filas de chips */}
      <div className="hidden md:flex flex-wrap gap-3 items-center">
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
          {OPCIONES_ORDEN.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Botón móvil */}
      <div className="md:hidden">
        <button
          onClick={() => setSheetAbierto(true)}
          className="relative flex items-center gap-2 border border-gray-300 px-4 py-2.5 text-sm text-gray-700 active:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filtrar y ordenar
          {filtrosActivos > 0 && (
            <span className="ml-0.5 bg-black text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {filtrosActivos}
            </span>
          )}
        </button>
      </div>

      {/* Overlay + bottom sheet móvil */}
      <div
        onClick={() => setSheetAbierto(false)}
        className={`md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          sheetAbierto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          sheetAbierto ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Filtrar y ordenar</h3>
          <button
            onClick={() => setSheetAbierto(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar filtros"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {tallas.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Talla</p>
              <div className="flex gap-2 flex-wrap">
                {tallas.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setParam("talla", tallaActual === t.nombre ? "" : t.nombre)}
                    className={`w-11 h-11 text-sm border transition-colors font-medium ${
                      tallaActual === t.nombre
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Ordenar por</p>
            <div className="space-y-1">
              {OPCIONES_ORDEN.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setParam("orden", o.value)}
                  className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors ${
                    ordenActual === o.value
                      ? "bg-black text-white"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))] border-t border-gray-100">
          <button
            onClick={() => setSheetAbierto(false)}
            className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            VER RESULTADOS
          </button>
        </div>
      </div>
    </div>
  );
}
