import Link from "next/link";

export const metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia de RELA, una marca de ropa minimalista hecha en Colombia.",
};

export default function About() {
  return (
    <main>
      {/* Hero de la página */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
            Nuestra historia
          </span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            No seguimos tendencias.
            <br />
            <span className="font-serif italic text-arena">Las ignoramos.</span>
          </h1>
        </div>
      </section>

      {/* Historia de la marca */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Cómo empezó
            </span>
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Nació de una inconformidad
            </h2>
            <p className="text-gray-600 leading-relaxed">
              RELA nació en Colombia con una idea simple: hacer ropa para
              personas que no necesitan que una etiqueta les diga quiénes son.
              Prendas que duran, que se sienten bien y que no gritan.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Cada pieza está pensada para ser tuya — no de una temporada, no de
              una tendencia. Solo tuya.
            </p>
          </div>

          {/* Imagen placeholder — puedes reemplazarla con una foto real */}
          <div className="bg-gray-100 aspect-square" />
        </div>
      </section>

      {/* Valores */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Lo que nos mueve
            </span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Nuestros valores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-4xl">🧵</div>
              <h3 className="font-bold text-gray-900">Calidad real</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Usamos materiales que duran. No fast fashion, no compromisos con
                la calidad.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-4xl">🇨🇴</div>
              <h3 className="font-bold text-gray-900">Hecho en Colombia</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Producción local, apoyo a la industria colombiana y orgullo por
                lo nuestro.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-4xl">✦</div>
              <h3 className="font-bold text-gray-900">Sin ruido</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Diseños limpios, sin logos gigantes ni estampados que griten.
                Solo la prenda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Conoce la colección
          </h2>
          <p className="mt-4 text-gray-500">
            Cada pieza tiene una historia. Encuentra la tuya.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block bg-black text-white px-10 py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            VER PRODUCTOS
          </Link>
        </div>
      </section>
    </main>
  );
}
