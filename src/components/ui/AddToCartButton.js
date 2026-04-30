"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { createClient } from "@/lib/supabase-browser";

export default function AddToCartButton({ product }) {
  const [selectedTalla, setSelectedTalla] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [variantes, setVariantes] = useState([]);
  const [stockActual, setStockActual] = useState(null);

  // Ref separado para cada botón
  const buttonDesktopRef = useRef(null);
  const buttonMobileRef = useRef(null);

  const { addItem } = useCart();
  const { showToast } = useToast();
  const { flyToCart } = useFlyToCart();

  useEffect(() => {
    const cargarVariantes = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("producto_variantes")
        .select(`stock, colores(id, nombre), tallas(id, nombre)`)
        .eq("producto_id", product.id);
      setVariantes(data || []);
    };
    cargarVariantes();
  }, [product.id]);

  useEffect(() => {
    if (!selectedColor || !selectedTalla) {
      setStockActual(null);
      return;
    }
    const variante = variantes.find(
      (v) =>
        v.colores?.nombre === selectedColor &&
        v.tallas?.nombre === selectedTalla,
    );
    setStockActual(variante ? variante.stock : 0);
  }, [selectedColor, selectedTalla, variantes]);

  const usaVariantes = variantes.length > 0;

  const coloresDisponibles = usaVariantes
    ? [
        ...new Map(
          variantes.map((v) => [v.colores?.nombre, v.colores]),
        ).values(),
      ].filter(Boolean)
    : (product.colores || []).map((nombre) => ({ nombre }));

  const tallasDisponibles = usaVariantes
    ? [
        ...new Map(variantes.map((v) => [v.tallas?.nombre, v.tallas])).values(),
      ].filter(Boolean)
    : (product.tallas || []).map((nombre) => ({ nombre }));

  const tallaAgotadaParaColor = (nombreTalla) => {
    if (!usaVariantes || !selectedColor) return false;
    const variante = variantes.find(
      (v) =>
        v.colores?.nombre === selectedColor && v.tallas?.nombre === nombreTalla,
    );
    return !variante || variante.stock === 0;
  };

  const handleSelectColor = (nombre) => {
    setSelectedColor(nombre);
    if (selectedTalla && tallaAgotadaParaColor(selectedTalla))
      setSelectedTalla("");
  };

  const stockParaMostrar = usaVariantes ? stockActual : product.stock;
  const agotado = stockParaMostrar !== null && stockParaMostrar === 0;

  const handleAddToCart = (ref) => {
    if (product.tallas?.length > 0 && !selectedTalla) {
      showToast("Por favor selecciona una talla");
      return;
    }
    if (product.colores?.length > 0 && !selectedColor) {
      showToast("Por favor selecciona un color");
      return;
    }
    if (agotado) {
      showToast("Esta combinación está agotada");
      return;
    }

    // Usamos el ref del botón que fue presionado
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      flyToCart(rect, product.imagenes?.[0] || "");
    }

    addItem(product, selectedTalla, selectedColor);
    showToast(`${product.nombre} agregado al carrito`);
  };

  const Selectores = () => (
    <>
      {coloresDisponibles.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {coloresDisponibles.map((color) => (
              <button
                key={color.nombre}
                type="button"
                onClick={() => handleSelectColor(color.nombre)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  selectedColor === color.nombre
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {color.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {tallasDisponibles.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Talla</p>
          <div className="flex gap-2 flex-wrap">
            {tallasDisponibles.map((talla) => {
              const agotadaParaColor = tallaAgotadaParaColor(talla.nombre);
              return (
                <button
                  key={talla.nombre}
                  type="button"
                  onClick={() =>
                    !agotadaParaColor && setSelectedTalla(talla.nombre)
                  }
                  disabled={agotadaParaColor}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedTalla === talla.nombre
                      ? "bg-black text-white border-black"
                      : agotadaParaColor
                        ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {talla.nombre}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {stockParaMostrar === null
          ? "Selecciona color y talla para ver disponibilidad"
          : stockParaMostrar > 0
            ? `${stockParaMostrar} unidades disponibles`
            : "Agotado"}
      </p>
    </>
  );

  return (
    <>
      {/* Desktop — usa buttonDesktopRef */}
      <div className="hidden md:block space-y-4">
        <Selectores />
        <button
          ref={buttonDesktopRef}
          onClick={() => handleAddToCart(buttonDesktopRef)}
          disabled={agotado}
          className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {agotado ? "AGOTADO" : "AGREGAR AL CARRITO"}
        </button>
      </div>

      {/* Móvil — selectores visibles en la página */}
      <div className="md:hidden space-y-4">
        <Selectores />
        <div className="h-20" />
      </div>

      {/* Botón sticky móvil — usa buttonMobileRef */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 z-30">
        <button
          ref={buttonMobileRef}
          onClick={() => handleAddToCart(buttonMobileRef)}
          disabled={agotado}
          className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {agotado
            ? "AGOTADO"
            : `AGREGAR — $${Number(product.precio).toLocaleString("es-CO")}`}
        </button>
      </div>
    </>
  );
}
