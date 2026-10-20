import Link from "next/link"
import FadeIn from "@/components/ui/FadeIn"
import { TERMINOS_VERSION } from "@/lib/legal-version"

export const metadata = {
  title: "Política de privacidad",
  description: "Cómo RELA recopila, usa y protege tus datos personales.",
}

export default function Privacy() {
  return (
    <main>

      {/* Hero */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Legal
            </span>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">
              Política de
              <br />
              <span className="font-serif italic text-arena">privacidad.</span>
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <FadeIn>
          <div className="space-y-8">

            <p className="text-xs text-gray-400">
              Última actualización: {TERMINOS_VERSION}
            </p>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Quiénes somos?</h2>
              <p className="text-gray-500 leading-relaxed">
                RELA es una marca de ropa colombiana. Esta política explica qué información
                recopilamos cuando visitas <strong className="text-gray-800">relatienda.com</strong>,
                creas una cuenta o haces un pedido, y qué hacemos con ella. Tratamos tus datos
                conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia (régimen
                de protección de datos personales — Habeas Data).
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Qué datos recopilamos?</h2>
              <ul className="space-y-2 mt-2">
                {[
                  "Datos de contacto y envío: nombre, teléfono, dirección, ciudad y departamento, cuando haces un pedido.",
                  "Correo electrónico, si lo dejas al pagar o si creas una cuenta — lo usamos para confirmarte el pedido y, si tienes cuenta, para iniciar sesión.",
                  "Historial de pedidos y productos que compras, asociados a tu cuenta si tienes una.",
                  "Datos de uso del sitio (páginas visitadas, dispositivo, ubicación aproximada) a través de Google Analytics, solo si aceptas las cookies de analítica.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-1 text-gray-900">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 leading-relaxed mt-3">
                No procesamos pagos con tarjeta dentro del sitio: el pago de tu pedido se
                coordina directamente por WhatsApp, así que RELA nunca recibe ni almacena
                datos de tarjetas en su plataforma.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Para qué usamos tus datos?</h2>
              <ul className="space-y-2 mt-2">
                {[
                  "Procesar, confirmar y entregar tus pedidos.",
                  "Comunicarnos contigo sobre tu compra (WhatsApp, correo).",
                  "Gestionar tu cuenta, si decides crear una.",
                  "Mejorar el sitio y entender qué productos y páginas funcionan mejor (analítica, solo con tu consentimiento).",
                  "Cumplir obligaciones legales o responder a requerimientos de autoridades competentes.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-1 text-gray-900">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Con quién compartimos tus datos?</h2>
              <p className="text-gray-500 leading-relaxed">
                No vendemos tus datos. Usamos proveedores externos para operar la tienda: una
                plataforma de base de datos y autenticación en la nube, un servicio de
                almacenamiento de imágenes, un servicio de envío de correos transaccionales, y
                herramientas de analítica web y hosting. Ninguno recibe más datos de los
                necesarios para su función, y todos están sujetos a sus propias políticas de
                seguridad. Cuando nos escribes por WhatsApp para coordinar tu pedido, esa
                conversación queda sujeta también a las políticas de WhatsApp. Si quieres el
                detalle exacto de cada proveedor, escríbenos a{" "}
                <a href="mailto:soporte.rela@gmail.com" className="underline text-gray-800 hover:text-black transition-colors">
                  soporte.rela@gmail.com
                </a>.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
              <p className="text-gray-500 leading-relaxed">
                Usamos cookies técnicas necesarias para que el carrito y el sitio funcionen, y
                cookies de analítica (Google Analytics) que solo se activan si aceptas el aviso
                de cookies que aparece al entrar al sitio. Puedes cambiar tu decisión o borrar
                las cookies en cualquier momento desde la configuración de tu navegador.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Tus derechos</h2>
              <p className="text-gray-500 leading-relaxed">
                Como titular de tus datos, tienes derecho a conocer, actualizar, rectificar y
                solicitar la eliminación de tu información, a revocar tu autorización, y a
                presentar quejas ante la Superintendencia de Industria y Comercio (SIC) si
                consideras que hemos manejado tus datos de forma indebida. Para ejercer
                cualquiera de estos derechos, escríbenos a{" "}
                <a href="mailto:soporte.rela@gmail.com" className="underline text-gray-800 hover:text-black transition-colors">
                  soporte.rela@gmail.com
                </a>.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">¿Cuánto tiempo guardamos tus datos?</h2>
              <p className="text-gray-500 leading-relaxed">
                Conservamos los datos de tus pedidos mientras sea necesario para fines
                comerciales, contables y legales. Si tienes una cuenta, tus datos se conservan
                mientras la mantengas activa; puedes solicitar su eliminación en cualquier
                momento escribiéndonos.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Cambios a esta política</h2>
              <p className="text-gray-500 leading-relaxed">
                Podemos actualizar esta política ocasionalmente. Si hacemos cambios
                importantes, lo indicaremos en esta misma página con la fecha de actualización.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Contacto</h2>
              <p className="text-gray-500 leading-relaxed">
                Si tienes dudas sobre esta política o sobre el tratamiento de tus datos,
                escríbenos a{" "}
                <a href="mailto:soporte.rela@gmail.com" className="underline text-gray-800 hover:text-black transition-colors">
                  soporte.rela@gmail.com
                </a>{" "}
                o revisa nuestros{" "}
                <Link href="/terms" className="underline text-gray-800 hover:text-black transition-colors">
                  términos y condiciones
                </Link>.
              </p>
            </div>

          </div>
        </FadeIn>
      </section>

    </main>
  )
}
