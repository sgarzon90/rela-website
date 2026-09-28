import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative text-white min-h-[90vh] flex items-end md:items-center justify-center overflow-hidden">

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradiente inferior. En móvil la foto llena el alto de la sección sin
          recortarse verticalmente, así que los rostros de los modelos quedan
          a la mitad de la pantalla: por eso el texto se ancla abajo (con un
          degradado más alto y oscuro que lo respalde) en vez de centrarse
          encima de las caras. En desktop se mantiene el look original. */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] md:h-32 bg-gradient-to-t from-black/90 md:from-black/40 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 pb-10 md:pb-0">
        <span className="text-xs tracking-[0.3em] text-arena uppercase">
          Nueva Colección 2026
        </span>

        <h1 className="mt-3 md:mt-4 text-4xl md:text-7xl font-bold tracking-tight leading-tight">
          Estilo que <br />
          <span className="font-serif italic text-arena">habla por ti</span>
        </h1>

        <p className="mt-3 md:mt-6 text-gray-300 text-base md:text-lg max-w-xs md:max-w-md mx-auto leading-relaxed">
          Ropa diseñada para quienes no necesitan seguir tendencias. Solo ser
          ellos mismos.
        </p>

        <div className="mt-6 md:mt-10 flex items-center justify-center gap-4 flex-wrap">
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