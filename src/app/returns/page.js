import Link from "next/link"
import FadeIn from "@/components/ui/FadeIn"

export const metadata = {
  title: "Devoluciones",
  description: "Política de devoluciones y garantía de RELA.",
}

const steps = [
  {
    number: "01",
    title: "Escríbenos",
    description: (
      <>
        Envía un correo a{" "}
        <a
          href="mailto:soporte.rela@gmail.com"
          className="underline text-gray-800 hover:text-black transition-colors"
        >
          soporte.rela@gmail.com
        </a>{" "}
        con tu número de pedido y una descripción del problema. Si es un defecto, adjunta fotos.
      </>
    ),
  },
  {
    number: "02",
    title: "Lo revisamos",
    description:
      "Nuestro equipo revisa tu caso en máximo 48 horas hábiles y te confirma si aplica la garantía o el cambio.",
  },
  {
    number: "03",
    title: "Te damos solución",
    description:
      "Si aplica defecto de fábrica, nosotros coordinamos el recojo sin costo para ti. Si es cambio de talla, te indicamos cómo proceder según el stock disponible.",
  },
]

export default function Returns() {
  return (
    <main>

      {/* Hero */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Devoluciones y garantía
            </span>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">
              Si algo no está bien,
              <br />
              <span className="font-serif italic text-arena">lo solucionamos.</span>
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Política principal */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <FadeIn>
          <div className="space-y-8">

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Garantía de 1 mes</h2>
              <p className="text-gray-500 leading-relaxed">
                Cada prenda RELA tiene una garantía de <strong className="text-gray-800">30 días calendario</strong> desde la fecha de entrega. Durante ese período cubrimos:
              </p>
              <ul className="space-y-2 mt-4">
                {[
                  "Defectos de fábrica visibles (costuras, bordados, acabados)",
                  "Prendas que lleguen en mal estado",
                  "Cambio de talla (sujeto a disponibilidad de stock)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-1 text-gray-900">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Cuánto tiempo tengo?</h2>
              <p className="text-gray-500 leading-relaxed">
                Tienes <strong className="text-gray-800">15 días calendario</strong> desde que recibes tu pedido para contactarnos. Pasado ese tiempo, no podremos gestionar el cambio o devolución.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Quién paga el envío?</h2>
              <div className="space-y-3 text-sm text-gray-500">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">Defecto de fábrica:</strong>{" "}
                  RELA asume el costo del envío de devolución. Es nuestro error, nuestra responsabilidad.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-gray-800">Cambio de talla:</strong>{" "}
                  El cliente asume el costo del envío de regreso. RELA cubre el envío de la prenda nueva.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Reembolso o cambio?</h2>
              <p className="text-gray-500 leading-relaxed">
                En la mayoría de casos gestionamos un <strong className="text-gray-800">cambio de producto</strong>. Si no hay stock disponible de la talla o referencia, evaluamos el reembolso caso a caso.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Qué NO cubre la garantía?</h2>
              <ul className="space-y-2 mt-2">
                {[
                  "Daños por mal uso o lavado incorrecto",
                  "Desgaste normal de la prenda",
                  "Solicitudes fuera del tiempo de garantía",
                  "Prendas sin etiqueta original o alteradas",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-1 text-gray-400">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* Pasos */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                El proceso
              </span>
              <h2 className="mt-3 text-3xl font-serif font-bold text-gray-900">
                ¿Cómo solicito una devolución?
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="space-y-4">
                  <span className="text-5xl font-bold text-gray-100">{step.number}</span>
                  <h3 className="font-bold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto directo */}
      <section className="py-20 px-6">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              ¿Tienes dudas?
            </h2>
            <p className="mt-4 text-gray-500">
              Escríbenos directamente. Somos un equipo pequeño y te respondemos personal.
            </p>
            <a
              href="mailto:soporte.rela@gmail.com"
              className="mt-8 inline-block bg-black text-white px-10 py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
            >
              CONTACTAR SOPORTE
            </a>
            <p className="mt-6 text-xs text-gray-400 tracking-wide">
              soporte.rela@gmail.com
            </p>
          </div>
        </FadeIn>
      </section>

    </main>
  )
}