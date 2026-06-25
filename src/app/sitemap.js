import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const paginas = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  const { data: productos } = await supabase
    .from("productos")
    .select("slug, created_at")
    .eq("activo", true);

  const paginasProductos = productos?.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.created_at),
    priority: 0.8,
  })) || [];

  return [...paginas, ...paginasProductos];
}
