"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  // Estado para guardar el usuario actual
  const [user, setUser] = useState(null)
  // Estado para saber si todavía estamos verificando la sesión
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    // Verificamos si hay una sesión activa al cargar la app
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Escuchamos cambios en la sesión (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    // Limpiamos el listener cuando el componente se desmonta
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar la autenticación desde cualquier componente
export const useAuth = () => useContext(AuthContext)