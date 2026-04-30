"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  // Estado específico para saber si el perfil está cargando
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  const supabase = createClient();

  const cargarPerfil = async (userId) => {
    setLoadingPerfil(true);
    const { data } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", userId)
      .single();
    setPerfil(data);
    setLoadingPerfil(false);
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) await cargarPerfil(session.user.id);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await cargarPerfil(session.user.id);
      } else {
        setPerfil(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, perfil, loading, loadingPerfil, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
