import Link from "next/link"

export default function CheckoutSuccess() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Ícono de éxito */}
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Pago exitoso!
        </h1>
        <p className="mt-3 text-gray-500">
          Tu orden fue procesada correctamente. 
          Recibirás un correo con los detalles de tu compra.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
        >
          SEGUIR COMPRANDO
        </Link>
      </div>
    </main>
  )
}