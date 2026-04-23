import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-black text-white min-h-[90vh] flex items-center justify-center">
      <div className="text-center px-6">
        <span className="text-xs tracking-[0.3em] text-arena uppercase">
          Nueva Colección 2025
        </span>

        <h1 className="mt-4 text-6xl md:text-7xl font-bold tracking-tight leading-tight">
          Estilo que <br />
          {/* Playfair en la palabra clave para contraste elegante */}
          <span className="font-serif italic text-arena">habla por ti</span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
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
