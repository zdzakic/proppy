# Proppy

## Projekat
- /property-landing → Next.js frontend
- /proppy_backend → Django backend

## Stack
- Frontend: Next.js (App Router), Tailwind, TypeScript strict
- Backend: Django REST Framework, PostgreSQL
- Multi-tenant: uvijek filtriraj po `company`

---

## Frontend

### Struktura
app/(auth)/     → Stranice koje zahtijevaju login
app/(public)/   → Javne stranice
components/ui/  → Generičke UI komponente
components/forms/ → Forme (bez logike, logika u hooks/)
hooks/          → Sva logika i API pozivi (jedan hook = jedan domain)
utils/api/      → Fetch wrapperi
types/          → TypeScript tipovi
app/globals.css → Jedino mjesto za boje i CSS varijable

### Pravila
- UI u komponentama, logika u hooks-ima — nikad API call direktno u komponenti
- Nema hardcoded boja — samo globals.css
- Mobile-first, dark/light tema mora raditi
- Bez `any`

---

## Backend

### Struktura
users/      → Auth, korisnici, permisije (auth_backend.py, validators.py)
properties/ → Core domain — nekretnine, plaćanja (serializers, permissions)
core/       → Shared logika, paginacija
dashboard/  → Dashboard agregati
settings/   → base.py + dev.py + prod.py

### Pravila
- Svaki app ima: models → serializers → views → urls
- Permisije u permissions.py, nikad inline u view-u
- Migracije uvijek generišeš svježe, nikad edituj stare
- Nove modele registruj u admin.py

---

## Opća pravila
- KISS — ako treba >50 linija, stani i pitaj
- Rekoristi postojeći kod prije nego napišeš novi
- Jedan fajl = jedna odgovornost
- Ako nisi siguran — pitaj, ne pogađaj
- Završi feature, ne refaktorišeš usred featuredija

## Komentari
Nakon svake nove komponente/funkcije:
- Šta radi | Zašto postoji | Šta bi puklo bez nje
- Inline komentari za neočitu logiku
- `// LEARN:` za koncepte koje treba istražiti

## Output
- Samo radni kod, male komponente
- Predloži plan u bullet points prije kodiranja, čekaj OK