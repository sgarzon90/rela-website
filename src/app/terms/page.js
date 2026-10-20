import Link from "next/link"
import FadeIn from "@/components/ui/FadeIn"
import { TERMINOS_VERSION } from "@/lib/legal-version"

export const metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de compra y uso del sitio de RELA.",
}

export default function Terms() {
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
              Términos y
              <br />
              <span className="font-serif italic text-arena">condiciones.</span>
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
              <p className="text-gray-500 leading-relaxed">
                Al usar <strong className="text-gray-800">relatienda.com</strong> o hacer un
                pedido con RELA, aceptas estos términos. Si tienes dudas sobre alguno,
                escríbenos antes de comprar a{" "}
                <a href="mailto:soporte.rela@gmail.com" className="underline text-gray-800 hover:text-black transition-colors">
                  soporte.rela@gmail.com
                </a>.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Productos y precios</h2>
              <p className="text-gray-500 leading-relaxed">
                Describimos e ilustramos cada producto lo más fielmente posible, pero los
                colores pueden variar ligeramente según la pantalla. Los precios están en pesos
                colombianos (COP) e incluyen IVA cuando aplica; pueden cambiar sin previo
                aviso, pero el precio válido es siempre el que aparece al momento de confirmar
                tu pedido. El stock mostrado puede variar — si un producto se agota justo
                después de que lo pides, te contactamos para ofrecerte un cambio o un
                reembolso.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Cómo funciona una compra</h2>
              <p className="text-gray-500 leading-relaxed">
                Al finalizar tu pedido en el sitio, se registra en nuestro sistema y se abre un
                chat de WhatsApp con el resumen. El pago y la confirmación final se coordinan
                por ese medio — tu pedido queda <strong className="text-gray-800">pendiente</strong> hasta
                que acordamos el pago y el envío contigo directamente.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Envíos y devoluciones</h2>
              <p className="text-gray-500 leading-relaxed">
                Los tiempos y costos de envío están detallados en nuestra página de{" "}
                <Link href="/shipping" className="underline text-gray-800 hover:text-black transition-colors">
                  Envíos
                </Link>, y las condiciones de garantía y cambios en la página de{" "}
                <Link href="/returns" className="underline text-gray-800 hover:text-black transition-colors">
                  Devoluciones
                </Link>. Ambas forman parte de estos términos.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Cuentas de usuario</h2>
              <p className="text-gray-500 leading-relaxed">
                Crear una cuenta es opcional — puedes comprar como invitado. Si creas una
                cuenta, eres responsable de mantener segura tu contraseña y de la actividad que
                ocurra con tu sesión. Puedes pedir que eliminemos tu cuenta en cualquier
                momento escribiéndonos.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Uso permitido del sitio</h2>
              <p className="text-gray-500 leading-relaxed">
                No está permitido usar el sitio para fines fraudulentos, intentar vulnerar su
                seguridad, registrar pedidos falsos, o usar de forma abusiva nuestros
                formularios o sistemas. Nos reservamos el derecho de cancelar pedidos que
                parezcan fraudulentos o de bloquear el acceso en esos casos.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Propiedad intelectual</h2>
              <p className="text-gray-500 leading-relaxed">
                El nombre RELA, el logo, las fotografías y los textos de este sitio son
                propiedad de RELA y no pueden reproducirse ni usarse sin autorización previa.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Responsabilidad</h2>
              <p className="text-gray-500 leading-relaxed">
                Hacemos lo posible para que la información del sitio sea precisa y esté
                disponible, pero no garantizamos que el servicio esté libre de interrupciones o
                errores. En la medida permitida por la ley, RELA no es responsable por daños
                indirectos derivados del uso del sitio.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Ley aplicable</h2>
              <p className="text-gray-500 leading-relaxed">
                Estas condiciones se rigen por las leyes de Colombia, incluyendo el Estatuto
                del Consumidor (Ley 1480 de 2011). Cualquier controversia se resolverá ante las
                autoridades competentes colombianas.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Cambios a estos términos</h2>
              <p className="text-gray-500 leading-relaxed">
                Podemos actualizar estos términos ocasionalmente; la fecha de la última
                actualización siempre aparece al inicio de esta página. Revisa nuestra{" "}
                <Link href="/privacy" className="underline text-gray-800 hover:text-black transition-colors">
                  política de privacidad
                </Link>{" "}
                para saber cómo tratamos tus datos.
              </p>
            </div>

          </div>
        </FadeIn>
      </section>

    </main>
  )
}
