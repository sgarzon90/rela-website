import Link from "next/link"

export default function Hero() {
  return (
    <section className="bg-black text-white min-h-[90vh] flex items-center justify-center">
      <div className="text-center px-6">

        {/* Etiqueta pequeña arriba */}
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          Nueva Colección 2025
        </span>

        {/* Título principal */}
        <h1 className="mt-4 text-6xl font-bold tracking-tight leading-tight">
          Estilo que <br />
          <span className="text-white italic">habla por ti</span>
        </h1>

        {/* Descripción */}
        <p className="mt-6 text-gray-400 text-lg max-w-md mx-auto">
          Ropa diseñada para quienes no necesitan seguir tendencias. 
          Solo ser ellos mismos.
        </p>

        {/* Botones */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/productos"
            className="bg-white text-black px-8 py-3 text-sm font-semibold tracking-widest hover:bg-gray-200 transition-colors"
          >
            VER COLECCIÓN
          </Link>
          <Link
            href="/nosotros"
            className="border border-white text-white px-8 py-3 text-sm font-semibold tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            NUESTRA HISTORIA
          </Link>
        </div>

      </div>
    </section>
  )
}