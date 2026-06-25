"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useFlyToCart } from "@/context/FlyToCartContext";

function ColorSelector({ colores, selectedColor, onSelect }) {
  if (colores.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-medium text-gray-900 mb-2">Color</p>
      <div className="flex gap-2 flex-wrap">
        {colores.map((color) => (
          <button
            key={color.nombre}
            type="button"
            onClick={() => onSelect(color.nombre)}
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
  );
}

function TallaSelector({ tallas, selectedTalla, onSelect, tallaAgotada }) {
  if (tallas.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-medium text-gray-900 mb-2">Talla</p>
      <div className="flex gap-2 flex-wrap">
        {tallas.map((talla) => {
          const agotada = tallaAgotada(talla.nombre);
          return (
            <button
              key={talla.nombre}
              type="button"
              onClick={() => !agotada && onSelect(talla.nombre)}
              disabled={agotada}
              className={`px-4 py-2 text-sm border transition-colors ${
                selectedTalla === talla.nombre
                  ? "bg-black text-white border-black"
                  : agotada
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
  );
}

export default function AddToCartButton({ product, variantes = [], onColorChange }) {
  const [selectedTalla, setSelectedTalla] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [stockActual, setStockActual] = useState(null);

  const buttonDesktopRef = useRef(null);
  const buttonMobileRef = useRef(null);

  const { addItem } = useCart();
  const { showToast } = useToast();
  const { flyToCart } = useFlyToCart();

  const usaVariantes = variantes.length > 0;

  const coloresDisponibles = usaVariantes
    ? [...new Map(variantes.map((v) => [v.colores?.nombre, v.colores])).values()].filter(Boolean)
    : (product.colores || []).map((nombre) => ({ nombre }));

  const tallasDisponibles = usaVariantes
    ? [...new Map(variantes.map((v) => [v.tallas?.nombre, v.tallas])).values()].filter(Boolean)
    : (product.tallas || []).map((nombre) => ({ nombre }));

  useEffect(() => {
    if (!selectedColor || !selectedTalla) {
      setStockActual(null);
      return;
    }
    const variante = variantes.find(
      (v) => v.colores?.nombre === selectedColor && v.tallas?.nombre === selectedTalla,
    );
    setStockActual(variante ? variante.stock : 0);
  }, [selectedColor, selectedTalla, variantes]);

  const tallaAgotadaParaColor = (nombreTalla) => {
    if (!usaVariantes || !selectedColor) return false;
    const variante = variantes.find(
      (v) => v.colores?.nombre === selectedColor && v.tallas?.nombre === nombreTalla,
    );
    return !variante || variante.stock === 0;
  };

  const handleSelectColor = (nombre) => {
    setSelectedColor(nombre);
    onColorChange?.(nombre);
    if (selectedTalla && tallaAgotadaParaColor(selectedTalla)) setSelectedTalla("");
  };

  const stockParaMostrar = usaVariantes ? stockActual : product.stock;
  const agotado = stockParaMostrar !== null && stockParaMostrar === 0;

  const imagenSeleccionada =
    (selectedColor && product.imagenes_por_color?.[selectedColor]?.[0]) ||
    product.imagenes?.[0] ||
    "";

  const handleAddToCart = (ref) => {
    if (coloresDisponibles.length > 0 && !selectedColor) {
      showToast("Por favor selecciona un color");
      return;
    }
    if (tallasDisponibles.length > 0 && !selectedTalla) {
      showToast("Por favor selecciona una talla");
      return;
    }
    if (agotado) {
      showToast("Esta combinación está agotada");
      return;
    }
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      flyToCart(rect, imagenSeleccionada);
    }
    addItem(product, selectedTalla, selectedColor, 1, imagenSeleccionada);
  };

  const stockLabel =
    stockParaMostrar === null
      ? "Selecciona color y talla para ver disponibilidad"
      : stockParaMostrar > 0
        ? `${stockParaMostrar} unidades disponibles`
        : "Agotado";

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block space-y-4">
        <ColorSelector
          colores={coloresDisponibles}
          selectedColor={selectedColor}
          onSelect={handleSelectColor}
        />
        <TallaSelector
          tallas={tallasDisponibles}
          selectedTalla={selectedTalla}
          onSelect={setSelectedTalla}
          tallaAgotada={tallaAgotadaParaColor}
        />
        <p className="text-sm text-gray-500">{stockLabel}</p>
        <button
          ref={buttonDesktopRef}
          onClick={() => handleAddToCart(buttonDesktopRef)}
          disabled={agotado}
          className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {agotado ? "AGOTADO" : "AGREGAR AL CARRITO"}
        </button>
      </div>

      {/* Móvil — selectores en página */}
      <div className="md:hidden space-y-4">
        <ColorSelector
          colores={coloresDisponibles}
          selectedColor={selectedColor}
          onSelect={handleSelectColor}
        />
        <TallaSelector
          tallas={tallasDisponibles}
          selectedTalla={selectedTalla}
          onSelect={setSelectedTalla}
          tallaAgotada={tallaAgotadaParaColor}
        />
        <p className="text-sm text-gray-500">{stockLabel}</p>
        <div className="h-20" />
      </div>

      {/* Botón sticky móvil */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 z-30">
        <button
          ref={buttonMobileRef}
          onClick={() => handleAddToCart(buttonMobileRef)}
          disabled={agotado}
          className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {agotado
            ? "AGOTADO"
            : `AGREGAR — $${Number(product.precio_descuento || product.precio).toLocaleString("es-CO")}`}
        </button>
      </div>
    </>
  );
}
