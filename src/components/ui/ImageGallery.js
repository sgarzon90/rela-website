"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageGallery({ imagenes, imagenesPorColor, selectedColor, nombre }) {
  const [current, setCurrent] = useState(0);

  const imagenesActivas =
    selectedColor && imagenesPorColor?.[selectedColor]?.length > 0
      ? imagenesPorColor[selectedColor]
      : (imagenes || []);

  useEffect(() => {
    setCurrent(0);
  }, [selectedColor]);

  if (imagenesActivas.length === 0) {
    return <div className="bg-gray-100 aspect-[3/4] w-full" />;
  }

  if (imagenesActivas.length === 1) {
    return (
      <div className="bg-gray-100 aspect-[3/4] overflow-hidden relative">
        <Image
          src={imagenesActivas[0]}
          alt={nombre}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const anterior = () =>
    setCurrent((prev) => (prev === 0 ? imagenesActivas.length - 1 : prev - 1));

  const siguiente = () =>
    setCurrent((prev) => (prev === imagenesActivas.length - 1 ? 0 : prev + 1));

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative bg-gray-100 aspect-[3/4] overflow-hidden group">
        <Image
          src={imagenesActivas[current]}
          alt={`${nombre} - foto ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          priority={current === 0}
        />

        <button
          onClick={anterior}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-9 h-9 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          ←
        </button>

        <button
          onClick={siguiente}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-9 h-9 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          →
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {imagenesActivas.map((_, i) => (
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

      {/* Miniaturas */}
      <div className="grid grid-cols-4 gap-2">
        {imagenesActivas.map((url, i) => (
          <button
            key={url}
            onClick={() => setCurrent(i)}
            className={`aspect-square overflow-hidden border-2 transition-colors relative ${
              i === current ? "border-black" : "border-transparent"
            }`}
          >
            <Image
              src={url}
              alt={`${nombre} miniatura ${i + 1}`}
              fill
              sizes="15vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
