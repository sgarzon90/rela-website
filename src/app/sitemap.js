import { supabase } from "@/lib/supabase"

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  // Páginas estáticas
  const paginas = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.7 },
  ]

  // Páginas dinámicas de productos
  const { data: productos } = await supabase
    .from("productos")
    .select("slug, created_at")
    .eq("activo", true)

  const paginasProductos = productos?.map((producto) => ({
    url: `${baseUrl}/products/${producto.slug}`,
    lastModified: new Date(producto.created_at),
    priority: 0.8,
  })) || []

  return [...paginas, ...paginasProductos]
}