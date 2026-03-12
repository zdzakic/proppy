/**
 * Path: src/utils/api/apiClient.ts
 *
 * CENTRALNI AXIOS CLIENT ZA AUTHENTICATED REQUESTE
 *
 * Šta radi:
 * - šalje sve API requeste prema backendu
 * - automatski dodaje JWT token iz localStorage
 * - presreće 401 greške i resetuje auth stanje
 *
 * Zašto postoji:
 * - centralizuje svu API komunikaciju
 * - sprečava ponavljanje token logike po komponentama
 *
 * Koji problem rješava:
 * - komponente ne moraju ručno dodavati Authorization header
 * - automatski logout ako token istekne
 *
 * Napomena:
 * - ovaj sloj je framework-agnostic (ne koristi React ni Next router)
 * - redirect koristi window.location jer je najjednostavniji i stabilan
 */

import axios from "axios";

/**
 * BASE API URL
 *
 * Definiše adresu backend servera.
 * Vrijednost dolazi iz .env konfiguracije.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * AXIOS INSTANCE
 *
 * Šta predstavlja:
 * - centralni HTTP client za sve authenticated requeste
 *
 * Zašto timeout:
 * - sprečava da request visi beskonačno ako backend ne odgovara
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 *
 * Šta radi:
 * - prije svakog requesta čita JWT token iz localStorage
 * - ako postoji, dodaje Authorization header
 *
 * Zašto:
 * - komponente ne moraju ručno dodavati token
 *
 * Problem koji rješava:
 * - dupliciranje auth logike u aplikaciji
 */
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 *
 * Šta radi:
 * - presreće backend greške
 * - detektuje 401 unauthorized odgovore
 *
 * Logika:
 *
 * 1️⃣ 401 sa /auth/login/
 *    → pogrešan email ili password
 *    → greška ide nazad u LoginForm
 *
 * 2️⃣ 401 sa drugih endpointa
 *    → token istekao ili nije validan
 *    → briše token i vraća korisnika na login
 *
 * 3️⃣ sve ostalo
 *    → samo proslijedi grešku dalje
 *
 * Zašto:
 * - centralno mjesto za auth sigurnost
 *
 * Problem koji rješava:
 * - aplikacija ostaje u nekonzistentnom stanju ako token istekne
 */
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    /**
     * LOGIN ERROR
     *
     * Ako login endpoint vrati 401
     * to znači da su credentials pogrešni.
     *
     * Ovdje NE radimo redirect.
     * Greška ide nazad u LoginForm.
     */
    if (status === 401 && url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    /**
     * TOKEN EXPIRED / UNAUTHORIZED
     *
     * Ako drugi endpoint vrati 401:
     * - token je istekao
     * - token nije validan
     *
     * Rješenje:
     * - ukloni token
     * - vrati korisnika na login
     */
    if (status === 401) {
      if (typeof window !== "undefined") {
        const isLoginPage = window.location.pathname.includes("/login");

        if (!isLoginPage) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }

    /**
     * DEFAULT ERROR
     *
     * Sve ostale greške samo prosljeđujemo dalje.
     * Komponente mogu same odlučiti kako će ih prikazati.
     */
    return Promise.reject(error);
  }
);

export default apiClient;