import Link from "next/link"
import { createClient } from "@/lib/supabase-server"

export default async function CategoriesSection() {
  const supabase = await createClient()
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre, slug, imagen")
    .order("nombre", { ascending: true })

  if (!categorias?.length) return null

  // Paleta de fondos para categorías sin imagen
  const fondos = [
    "bg-stone-100",
    "bg-zinc-200",
    "bg-neutral-100",
    "bg-slate-100",
    "bg-gray-200",
    "bg-stone-200",
  ]

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          Explorar
        </span>
        <h2 className="mt-2 text-3xl font-serif font-bold text-gray-900">
          Categorías
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categorias.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/products?categoria=${cat.slug}`}
            className="group relative aspect-[3/4] overflow-hidden"
          >
            {cat.imagen ? (
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className={`absolute inset-0 ${fondos[i % fondos.length]} transition-colors duration-300 group-hover:brightness-95`}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-block bg-white text-black text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5">
                {cat.nombre}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
