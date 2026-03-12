"use client";

/**
 * Path: src/context/AuthContext.tsx
 *
 * CENTRALNI AUTH KONTEKST ZA APLIKACIJU
 *
 * Šta radi:
 * - drži auth stanje (user, token, loading)
 * - izlaže login i logout funkcije
 *
 * Zašto postoji:
 * - centralizuje auth logiku
 * - UI komponente ne rade direktno sa tokenima
 *
 * Problem koji rješava:
 * - auth logika ne bude rasuta po komponentama
 * - login/logout flow je kontrolisan
 */

import React,
{
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import apiClient from "@/utils/api/apiClient";
import { useRouter } from "next/navigation";

/**
 * AUTH CONTEXT TYPE
 *
 * Javni ugovor koji ostatak aplikacije koristi.
 */
type AuthContextType =
{
  user: any;
  token: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

/**
 * CONTEXT INSTANCE
 *
 * Omogućava dijeljenje auth state-a kroz cijelu aplikaciju.
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AUTH PROVIDER
 *
 * Šta radi:
 * - drži kompletno auth stanje
 * - omotava aplikaciju
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) =>
{
  const router = useRouter();

  /**
   * USER STATE
   *
   * Informacije o trenutno logovanom korisniku.
   */
  const [user, setUser] = useState<any>(null);

  /**
   * TOKEN STATE
   *
   * JWT access token.
   */
  const [token, setToken] = useState<string | null>(null);

  /**
   * LOADING STATE
   *
   * signalizira auth operacije
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * INIT TOKEN LOAD
   *
   * Šta radi:
   * - čita token iz localStorage
   *
   * Zašto:
   * - localStorage ne postoji na serveru
   */
  useEffect(() =>
  {
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken)
    {
      setToken(storedToken);
    }

  }, []);

  /**
   * TOKEN GUARD
   *
   * Ako token nestane → resetuj user.
   *
   * Problem koji rješava:
   * - UI ne ostaje u "ghost login" stanju.
   */
  useEffect(() =>
  {
    if (!token)
    {
      setUser(null);
    }

  }, [token]);

  /**
   * LOGIN FUNKCIJA
   *
   * Šta radi:
   * - poziva backend login endpoint
   * - sprema access token
   * - postavlja user state
   * - redirectuje na dashboard
   */
  const login = async (email: string, password: string) =>
  {
    setIsLoading(true);

    try
    {
      const response = await apiClient.post("/auth/login/",
      {
        email,
        password
      });

      const { access, user } = response.data;

      /**
       * KISS token storage
       */
      localStorage.setItem("accessToken", access);

      setToken(access);
      setUser(user);

      /**
       * Redirect nakon uspješnog login-a
       */
      router.replace("/dashboard");
    }

    catch (error)
    {
      /**
       * Ako login ne uspije
       * očisti auth stanje.
       */
      setToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");

      throw error;
    }

    finally
    {
      setIsLoading(false);
    }
  };

  /**
   * LOGOUT FUNKCIJA
   *
   * Šta radi:
   * - briše auth stanje
   * - briše token
   * - redirect na login
   */
  const logout = () =>
  {
    setUser(null);
    setToken(null);

    localStorage.removeItem("accessToken");

    router.replace("/login");
  };

  /**
   * CONTEXT VALUE
   *
   * Sve što aplikacija koristi.
   */
  const value: AuthContextType =
  {
    user,
    token,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth HOOK
 *
 * Siguran pristup AuthContext-u.
 */
export const useAuth = () =>
{
  const ctx = useContext(AuthContext);

  if (!ctx)
  {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};