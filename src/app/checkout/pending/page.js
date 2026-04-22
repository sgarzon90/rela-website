import Link from "next/link"

export default function CheckoutPending() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Ícono de pendiente */}
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Pago pendiente
        </h1>
        <p className="mt-3 text-gray-500">
          Tu pago está siendo procesado. 
          Te notificaremos por correo cuando se confirme.
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