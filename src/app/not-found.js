import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-8xl font-bold text-gray-100 select-none">404</p>
        <h1 className="text-xl font-bold text-gray-900 -mt-4">Página no encontrada</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors"
          >
            VER PRODUCTOS
          </Link>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 text-sm font-semibold hover:border-black transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
