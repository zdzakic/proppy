# 🏗️ Proppy Architecture Guide
**Structure Today, Scalable Tomorrow**

## 🔰 Overview

Proppy is a full-stack property management application supporting multiple user roles: `COMPANYADMIN`, `OWNER`, and `TENANT`.

**Stack:**
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Backend | Django 5.2 + Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Icons | Lucide React |
| Animation | Framer Motion |
| Testing | Vitest + React Testing Library |

---

## 📁 Project Structure

### Frontend (`property-landing/`)

| Folder | Purpose |
|--------|---------|
| `app/(auth)/` | Route group: login, register, forgot-password, reset-password. Clean URLs without `/auth/` prefix. |
| `app/(public)/` | Route group: public landing/marketing pages. Separate layout from auth/dashboard. |
| `app/dashboard/` | Protected routes: companies, properties, profile, settings, how-to-use. Role-based access. |
| `app/globals.css` | **Central design tokens** – all colors, shadows, radii defined as CSS variables. Tailwind v4 `@theme` directive. |
| `components/dashboard/` | Dashboard-specific components (stats cards, data tables, charts). |
| `components/layout/` | Layout primitives (Header, Footer, Navigation shells). |
| `components/sections/` | Landing page sections (Hero, Features, Testimonials). |
| `components/theme/` | Theme provider – dark/light mode toggle and context. |
| `components/ui/` | **Reusable UI primitives** – Button, Card, Input, Modal, Badge. Domain-agnostic. |
| `config/routes.ts` | **Single source of truth** for all app routes. Prevents hardcoded strings and typos. |
| `config/navigation.tsx` | Role-based sidebar and user menu configurations. |
| `constants/` | Static content (footer links, legal pages). |
| `context/` | React context providers (AuthContext, ThemeContext). |
| `hooks/` | **Business logic hooks** – one hook per feature (useCompaniesManager, useCreateProperty, useLogin). |
| `types/` | TypeScript interfaces (Company, Property, Auth types). |
| `utils/api/` | API client setup, request/response interceptors. |
| `utils/auth/` | Auth helpers (token storage, decode). |
| `utils/table/` | Table formatting utilities. |

### Backend (`proppy_backend/`)

| Folder | Purpose |
|--------|---------|
| `settings/base.py` | Common settings (INSTALLED_APPS, MIDDLEWARE, REST_FRAMEWORK config). |
| `settings/dev.py` | **Dev config**: SQLite, DEBUG=True, 60-day JWT lifetime, console email backend. |
| `settings/prod.py` | **Prod config**: PostgreSQL, SSL redirect, whitenoise static files, password validators. |
| `core/` | Tenant-aware base models, shared utilities across apps. |
| `users/` | Custom User model, JWT auth views, serializers, validators. |
| `properties/` | **Domain models**: Company, Block, Property, PropertyOwner, UserRookeryRole, Services. |
| `dashboard/` | Dashboard API endpoints and analytics views. |
| `urls.py` | Root URL routing to app-specific urls. |

---

## 🗄️ Database Per Environment

**Development** (`settings/dev.py`):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**Production** (`settings/prod.py`):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

---

## 🗃️ Domain Model (Backend)

Hierarchy: **Company → Block → Property**

| Model | Purpose |
|-------|---------|
| `Company` | Top-level tenant. Property management company. |
| `Block` | Building/development. Belongs to one Company. |
| `Property` | Individual apartment/flat/unit. Belongs to one Block. |
| `PropertyOwner` | Links User ↔ Property. Tracks ownership history with date ranges. |
| `UserRookeryRole` | **Access control** – defines user's role per company. FK to Role model. |
| `Service` / `UserService` | External service providers (plumbers, electricians). |

**Important distinction:**
- `PropertyOwner` = **Ownership** (who owns what property)
- `UserRookeryRole` = **Access control** (who can access the app and with what permissions)

---

## 🎨 Design System

### CSS Tokens (`globals.css`)

Tailwind v4 uses CSS-first configuration via `@theme`:

```css
@theme {
  --color-brand-primary: var(--primary);      /* #0E1B2E */
  --color-brand-accent: var(--accent);        /* #B89B5E */
  --color-brand-surface: var(--surface);      /* #FFFFFF */
  --color-dashboard-sidebar: var(--dashboard-sidebar);  /* #0D1B2A */
  --color-dashboard-accent: var(--dashboard-accent);      /* #D4AF37 */
  --box-shadow-premium: 0 20px 50px rgba(0,0,0,0.08);
  --border-radius-xl: 1rem;
}
```

Usage: `bg-brand-primary`, `text-dashboard-accent`, `shadow-premium`

### Mobile-First Responsive

| Breakpoint | Usage |
|------------|-------|
| Default | Mobile – base styles, min-height: 55vh |
| `sm:` (640px) | Tablet – increased spacing, larger typography |
| `lg:` (1024px) | Desktop – multi-column layouts, full navigation |
| `xl:` (1280px) | Large screens – max-width containers |

### Theme System (Light/Dark)

Located in `components/theme/` and `app/globals.css`:

| File | Purpose |
|------|---------|
| `ThemeProvider.tsx` | React context for theme state management |
| `ThemeToggle.tsx` | UI toggle button for switching themes |

**Token Architecture** (defined in `globals.css`):
- `:root` – Light mode default tokens (brand + dashboard colors)
- `.dark` – Dark mode override tokens
- Tokens auto-switch via `className="dark"` on `<html>` element

**Key tokens that change per theme:**
```css
/* Light mode (default) */
:root {
  --bg: #F6F4EF;
  --surface: #FFFFFF;
  --text: #1C1C1C;
  --dashboard-bg: #F4F6F9;
  --dashboard-sidebar: #0D1B2A;
}

/* Dark mode */
.dark {
  --bg: #0B1320;
  --surface: #111C2E;
  --text: #F3F4F6;
  --dashboard-bg: #0F172A;
  --dashboard-sidebar: #020617;
}
```

Usage stays the same: `bg-brand-bg`, `text-brand-text`, `bg-dashboard-sidebar`

---

## 🔑 Key Patterns

### Route Groups `(folder)/`
- `(auth)/login` → URL is `/login` (no `/auth/` in path)
- Allows different root layouts for auth vs dashboard vs public
- Cleaner URLs without layout nesting in path

### Centralized Routes Config
```typescript
// config/routes.ts
export const ROUTES = {
  AUTH: { LOGIN: "/login", REGISTER: "/register" },
  DASHBOARD: "/dashboard",
  DASHBOARD_PAGES: {
    COMPANY_ADMIN: { COMPANIES: "/dashboard/companies", ... },
    OWNER: { PROPERTIES: "/dashboard/properties", ... },
  },
};
```
- Prevents typos in route strings
- Refactor routes in one place
- Type-safe navigation

### Role-Based Navigation
```typescript
// config/navigation.tsx
const dashboardSidebarByRole: Record<AppRole, DashboardMenuItemConfig[]> = {
  COMPANYADMIN: [...],
  OWNER: [...],
  TENANT: [...],
};
```
- Each role sees different sidebar items
- `getPrimaryRole()` determines main role from user's role list

### Custom Hooks Pattern
Each major feature has a dedicated hook:
- `useCompaniesManager.ts` – CRUD operations, loading states, errors
- `useCreateProperty.ts` – Multi-step property creation flow
- `useLogin.ts` / `useForgotPassword.ts` – Auth flows with toast notifications

---

## 🔗 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/auth/login/` | JWT token obtain (access + refresh) |
| `/api/auth/register/` | User registration with email validation |
| `/api/auth/me/` | Current user info with roles |
| `/api/companies/` | Company CRUD (COMPANYADMIN only) |
| `/api/properties/` | Property CRUD with block/property hierarchy |
| `/api/dashboard/summary/` | Dashboard metrics and stats |

---

## ✅ Organization Principles

| Pattern | When to use |
|---------|-------------|
| `components/ui/` | Generic UI primitives – no business logic, purely presentational |
| `components/dashboard/` | Domain-specific components tied to property/company models |
| `hooks/` | Business logic and data fetching – one hook per domain action |
| `config/` | App-wide configuration – routes, navigation, feature flags |
| `utils/{domain}/` | Group utilities by domain (api, auth, table formatting) |
| `(group)/` | Route groups for clean URLs and layout separation |

---

## 🧠 Development Mantra

> "Every folder has a purpose. Build small, think scalable."

---

## 📌 Future To-Dos

- [ ] Add `lib/api/` – centralized API modules with error handling
- [ ] Add test coverage by role and endpoint
- [ ] Add CI/CD pipeline configuration (GitHub Actions)
- [ ] Consider monorepo extraction for shared UI components
