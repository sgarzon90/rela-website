import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Cliente de Supabase para usar en el servidor (Server Components y API routes)
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Función para leer cookies de la sesión
        getAll() {
          return cookieStore.getAll()
        },
        // Función para guardar cookies de la sesión
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // En Server Components no siempre se pueden escribir cookies
          }
        },
      },
    }
  )
}