import Link from "next/link"

export default function CheckoutFailure() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Ícono de error */}
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Pago rechazado
        </h1>
        <p className="mt-3 text-gray-500">
          Hubo un problema con tu pago. 
          Por favor intenta de nuevo con otro método de pago.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </main>
  )
}