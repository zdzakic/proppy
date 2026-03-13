"use client";

/**
 * Path: src/context/AuthContext.tsx
 *
 * CENTRALNI AUTH KONTEKST
 *
 * Šta radi:
 * - drži user state
 * - login / logout funkcije
 * - restore session iz localStorage
 *
 * Zašto:
 * - jedno centralno mjesto za auth logiku
 * - UI komponente ne zovu direktno API
 *
 * KISS princip:
 * - samo ono što je potrebno za MVP
 */

import { createContext, useContext, useEffect, useState } from "react";
import apiPublic from "@/utils/api/apiPublic";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  /**
   * AUTH STATE
   *
   * Ako user postoji → korisnik je logovan
   */
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  /**
   * RESTORE SESSION
   *
   * Nakon refresh-a stranice
   * učitava user iz localStorage
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * LOGIN
   *
   * Poziva Django SimpleJWT endpoint
   * Sprema access + refresh token
   */
  const login = async (email: string, password: string) => {

    setIsLoading(true);

    try {

      const response = await apiPublic.post("/api/token/", {
        email,
        password,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      /**
       * redirect na dashboard
       */
      router.replace("/dashboard");

    } finally {
      setIsLoading(false);
    }
  };

  /**
   * LOGOUT
   *
   * briše auth stanje
   * briše storage
   */
  const logout = () => {

    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth
 *
 * Siguran pristup AuthContextu
 */
export const useAuth = () => {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};