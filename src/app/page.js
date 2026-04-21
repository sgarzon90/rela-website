import { supabase } from "@/lib/supabase"
import Hero from "@/components/sections/Hero"
import FeaturedProducts from "@/components/sections/FeaturedProducts"

export default async function Home() {
  const { data: categorias, error } = await supabase
    .from("categorias")
    .select("*")
    
  return (
    <main>
      <Hero />
      <FeaturedProducts />
    </main>
  )
}