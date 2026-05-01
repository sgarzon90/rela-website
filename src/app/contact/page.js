import Link from "next/link"
import FadeIn from "@/components/ui/FadeIn"

export const metadata = {
  title: "Contacto",
  description: "Contáctanos por WhatsApp o correo. RELA responde rápido.",
}

const WHATSAPP_NUMBER = "573160180678"
const WHATSAPP_MESSAGE = encodeURIComponent("Hola RELA 👋 Quiero hacer un pedido.")

const contactOptions = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "+57 316 018 0678",
    description: "La forma más rápida. Te respondemos en minutos.",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
    cta: "Abrir WhatsApp",
    external: true,
    highlight: true,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Correo",
    value: "soporte.rela@gmail.com",
    description: "Para dudas sobre pedidos, devoluciones o garantías.",
    href: "mailto:soporte.rela@gmail.com",
    cta: "Enviar correo",
    external: false,
    highlight: false,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    label: "Instagram",
    value: "@rela_tienda",
    description: "Síguenos y escríbenos por DM.",
    href: "https://www.instagram.com/rela_tienda/",
    cta: "Ir a Instagram",
    external: true,
    highlight: false,
  },
]

export default function Contact() {
  return (
    <main>

      {/* Hero */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Contacto
            </span>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">
              Hablemos.
              <br />
              <span className="font-serif italic text-arena">Estamos aquí.</span>
            </h1>
            <p className="mt-6 text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
              ¿Quieres hacer un pedido, tienes una duda o algo no salió bien? Escríbenos por el canal que prefieras.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Opciones de contacto */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`
                flex flex-col h-full p-8 border transition-all duration-300
                ${option.highlight
                  ? "border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10"
                  : "border-gray-200 hover:border-gray-400"
                }
              `}>
                <div className={option.highlight ? "text-[#25D366]" : "text-gray-700"}>
                  {option.icon}
                </div>
                <div className="mt-4 flex-1 space-y-2">
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">{option.label}</p>
                  <p className="font-bold text-gray-900 text-sm">{option.value}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{option.description}</p>
                </div>
                <a
                  href={option.href}
                  target={option.external ? "_blank" : undefined}
                  rel={option.external ? "noopener noreferrer" : undefined}
                  className={`
                    mt-6 block text-center text-sm font-semibold tracking-widest py-3 px-4 transition-colors
                    ${option.highlight
                      ? "bg-[#25D366] text-white hover:bg-[#1ebe5d]"
                      : "bg-black text-white hover:bg-gray-800"
                    }
                  `}
                >
                  {option.cta.toUpperCase()}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Nota de tiempo de respuesta */}
      <section className="bg-gray-50 py-16 px-6">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">Tiempo de respuesta</p>
            <p className="text-gray-600 leading-relaxed">
              Por WhatsApp respondemos en minutos durante el día. Por correo, en máximo <strong className="text-gray-800">48 horas hábiles</strong>.
            </p>
            <p className="text-sm text-gray-400">
              Somos un equipo pequeño. Cada mensaje lo atiende una persona real.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Links rápidos */}
      <section className="py-16 px-6">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-gray-500 mb-6">También puede que encuentres tu respuesta aquí:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shipping"
                className="text-sm border border-gray-300 px-6 py-2 hover:border-black hover:text-black transition-colors text-gray-600"
              >
                Información de envíos
              </Link>
              <Link
                href="/returns"
                className="text-sm border border-gray-300 px-6 py-2 hover:border-black hover:text-black transition-colors text-gray-600"
              >
                Devoluciones y garantía
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  )
}