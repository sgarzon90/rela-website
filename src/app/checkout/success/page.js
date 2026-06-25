import Link from "next/link"

export default function CheckoutSuccess() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-5">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Pedido registrado!</h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Tu pedido fue guardado exitosamente. Nos pondremos en contacto contigo por WhatsApp para coordinar el pago y el envío.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="bg-black text-white px-6 py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            VER MIS ÓRDENES
          </Link>
          <Link
            href="/products"
            className="border border-gray-300 text-gray-700 px-6 py-3 text-sm font-semibold hover:border-black transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  )
}
