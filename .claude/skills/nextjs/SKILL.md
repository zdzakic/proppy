---
name: nextjs
description: >
  Koristi za Next.js frontend rad u Proppyu — komponente, hooks, stranice,
  API integracija. Trigeri: "nova komponenta", "hook", "stranica", "UI",
  "forma", "dashboard", "frontend"
---

## Proppy-specifična pravila

- Boje SAMO iz `app/globals.css` — nikad hardcoded, nikad inline styles
- API pozivi SAMO u hooks, nikad direktno u komponenti
- Provjeri `apiClient` baseURL — izbjegavaj `/api/api` duplikaciju u path-u
- Uvijek proslijedi `company` u API pozivima (multi-tenant)
- Dark/light tema mora raditi — provjeri theme toggle

## Struktura projekta

- `app/(auth)/` → stranice koje zahtijevaju login
- `app/(public)/` → javne stranice  
- `components/ui/` → generičke komponente — provjeri postoji li prije nego praviš novu
- `components/forms/` → forme bez logike
- `hooks/` → sva logika i API pozivi, jedan hook = jedan domain
- `utils/api/` → fetch wrapperi i apiClient
- `types/` → TypeScript interfejsi

## Redosljed za novi feature

1. Provjeri postoji li sličan hook/komponenta — rekoristi
2. Definiši TypeScript tip u `types/`
3. API logika u `hooks/`
4. Komponenta koristi hook, samo prikazuje

## Prije završetka

Provjeri: mobile 375px, dark theme toggle, loading i error state.
