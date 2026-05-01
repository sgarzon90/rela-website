import Link from "next/link"
import FadeIn from "@/components/ui/FadeIn"

export const metadata = {
  title: "Envíos",
  description: "Información sobre envíos de RELA. Despachamos a todo Colombia.",
}

const shippingDetails = [
  {
    icon: "📦",
    title: "Cobertura",
    description: "Despachamos a todo Colombia, incluyendo ciudades principales y municipios.",
  },
  {
    icon: "🚚",
    title: "Transportadora",
    description: "Trabajamos con las principales transportadoras del país: Servientrega, Coordinadora y Envia.",
  },
  {
    icon: "📅",
    title: "Días de despacho",
    description: "Despachamos todos los días. Tu pedido sale el mismo día si se realiza antes de las 12:00 p.m.",
  },
  {
    icon: "⏱️",
    title: "Tiempos de entrega",
    description: "Los tiempos dependen de la transportadora y tu ubicación. Ciudades principales: 1–3 días hábiles. Municipios: 3–6 días hábiles.",
  },
]

export default function Shipping() {
  return (
    <main>

      {/* Hero */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Envíos
            </span>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">
              Tu pedido llega.
              <br />
              <span className="font-serif italic text-arena">Sin complicaciones.</span>
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Envío gratis */}
      <section className="py-16 px-6 border-b border-gray-100">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-gray-900">Envío gratis en compras mayores a $250.000</h2>
            <p className="mt-3 text-gray-500 leading-relaxed">
              En compras menores, el costo del envío se calcula según tu ubicación al momento de pagar.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Detalles */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                Cómo funciona
              </span>
              <h2 className="mt-3 text-3xl font-serif font-bold text-gray-900">
                Todo lo que necesitas saber
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shippingDetails.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white p-8 space-y-3 border border-gray-100">
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Nota importante */}
      <section className="py-16 px-6 border-b border-gray-100">
        <FadeIn>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seguimiento de tu pedido</h2>
            <p className="text-gray-500 leading-relaxed">
              Una vez despachado, recibirás el número de guía al correo registrado para que puedas rastrear tu paquete directamente en la página de la transportadora.
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Si tienes alguna duda sobre tu envío, escríbenos a{" "}
              <a
                href="mailto:soporte.rela@gmail.com"
                className="underline text-gray-800 hover:text-black transition-colors"
              >
                soporte.rela@gmail.com
              </a>{" "}
              y te respondemos lo antes posible.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              ¿Listo para pedir?
            </h2>
            <p className="mt-4 text-gray-500">
              Encuentra tu próxima prenda favorita.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-block bg-black text-white px-10 py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
            >
              VER PRODUCTOS
            </Link>
          </div>
        </FadeIn>
      </section>

    </main>
  )
}