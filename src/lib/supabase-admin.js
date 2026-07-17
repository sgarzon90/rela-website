import { createClient } from "@supabase/supabase-js";

// Cliente con privilegios de servicio (bypassa RLS). Solo usar en codigo
// que corre en el servidor (API routes, Server Components) y nunca
// exponerlo al navegador.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
