import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative text-white min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradiente sutil en la parte inferior para transición suave al contenido */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-6">
        <span className="text-xs tracking-[0.3em] text-arena uppercase">
          Nueva Colección 2026
        </span>

        <h1 className="mt-4 text-6xl md:text-7xl font-bold tracking-tight leading-tight">
          Estilo que <br />
          <span className="font-serif italic text-arena">habla por ti</span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
          Ropa diseñada para quienes no necesitan seguir tendencias. Solo ser
          ellos mismos.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/products"
            className="bg-white text-black px-8 py-3 text-sm font-semibold tracking-widest hover:bg-arena transition-colors duration-300"
          >
            VER COLECCIÓN
          </Link>
          <Link
            href="/about"
            className="border border-white text-white px-8 py-3 text-sm font-semibold tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            NUESTRA HISTORIA
          </Link>
        </div>
      </div>
    </section>
  );
}