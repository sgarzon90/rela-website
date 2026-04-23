"use client"

import { useState } from "react"

export default function ImageGallery({ imagenes, nombre }) {
  // Índice de la imagen que se está mostrando actualmente
  const [current, setCurrent] = useState(0)

  // Si no hay imágenes mostramos un placeholder
  if (!imagenes || imagenes.length === 0) {
    return <div className="bg-gray-100 aspect-[3/4] w-full" />
  }

  // Si solo hay una imagen no mostramos los controles
  if (imagenes.length === 1) {
    return (
      <div className="bg-gray-100 aspect-[3/4] overflow-hidden">
        <img
          src={imagenes[0]}
          alt={nombre}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  const anterior = () => {
    // Si estamos en la primera imagen vamos a la última
    setCurrent((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
  }

  const siguiente = () => {
    // Si estamos en la última imagen vamos a la primera
    setCurrent((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">

      {/* Imagen principal con botones de navegación */}
      <div className="relative bg-gray-100 aspect-[3/4] overflow-hidden group">
        <img
          src={imagenes[current]}
          alt={`${nombre} - foto ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Botón anterior */}
        <button
          onClick={anterior}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-9 h-9 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        >
          ←
        </button>

        {/* Botón siguiente */}
        <button
          onClick={siguiente}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-9 h-9 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        >
          →
        </button>

        {/* Indicador de posición */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {imagenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>

      {/* Miniaturas de todas las imágenes */}
      <div className="grid grid-cols-4 gap-2">
        {imagenes.map((url, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`aspect-square overflow-hidden border-2 transition-colors ${
              i === current ? "border-black" : "border-transparent"
            }`}
          >
            <img
              src={url}
              alt={`${nombre} miniatura ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

    </div>
  )
}