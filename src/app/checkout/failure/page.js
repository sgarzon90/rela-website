import Link from "next/link"

export default function CheckoutFailure() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Algo salió mal</h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Hubo un problema al procesar tu pedido. Por favor intenta de nuevo o contáctanos directamente por WhatsApp.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checkout"
            className="bg-black text-white px-6 py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            INTENTAR DE NUEVO
          </Link>
          <a
            href="https://wa.me/573160180678"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 text-gray-700 px-6 py-3 text-sm font-semibold hover:border-black transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
