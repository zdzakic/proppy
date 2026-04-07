# 🏗️ Proppy Architecture Guide  
**Structure Today, Scalable Tomorrow**


## 🔰 Overview

Proppy is a modular property management application supporting multiple user roles: `owner`, `tenant`, and `admin`.

The architecture is optimized for a clean MVP setup with clear scalability paths for future growth.

---

## 📁 Frontend Structure (React – Vite)
src/
├── pages/
│   └── dashboard/
│       ├── DashboardRouter.jsx       # role-based redirekcija
│       ├── owner/
│       │   ├── OwnerDashboard.jsx
│       │   ├── Finances.jsx
│       │   └── HealthSafety.jsx
│       ├── tenant/
│       │   ├── TenantDashboard.jsx
│       │   ├── Rent.jsx
│       │   └── Maintenance.jsx
│       └── admin/
│           └── AdminDashboard.jsx
├── components/
│   ├── owner/
│   │   ├── SummaryCard.jsx
│   │   └── FinanceTable.jsx
│   ├── tenant/
│   │   ├── RentCard.jsx
│   │   └── MaintenanceForm.jsx
│   ├── admin/
│   │   └── OwnersTable.jsx
│   └── shared/
│       ├── Sidebar.jsx
│       ├── Loader.jsx
│       ├── ProtectedRoute.jsx
│       └── ThemeToggle.jsx


---

## 🔌 Frontend Design Guidelines

- ✅ Components used by only one role → `components/{role}/`
- ✅ UI components reused across roles → `components/shared/`
- ✅ Role-specific pages → `pages/dashboard/{role}/`
- ✅ Axios and API logic → `util/axios.js` or `features/{module}/api.js`
- ✅ Routing handled via `DashboardRouter.jsx` with lazy loading and role redirection

---

## 🛠️ Backend Structure (Django + DRF)
proppy_backend/
├── dashboard/
│   ├── views/
│   │   ├── owner_summary.py
│   │   ├── owner_finance.py
│   │   ├── tenant_summary.py
│   │   ├── tenant_rent.py
│   │   └── shared_notifications.py
│   ├── urls.py         # grupisane API rute
│   └── tests/
│       └── test_views.py
├── users/
│   └── permissions.py   # npr. IsOwnerOrAdmin, IsTenant
├── properties/
│   └── models.py
├── serializers/
│   └── serializers.py
├── tests/
│   └── test_views.py
├── urls.py
├── wsgi.py
└── settings.py


---

## 🔗 Backend API Endpoints

| URL                                    | Role   | Description                         |
|----------------------------------------|--------|-------------------------------------|
| `/api/dashboard/owner/summary/`        | owner  | Summary metrics                     |
| `/api/dashboard/owner/finances/`       | owner  | Financial transactions              |
| `/api/dashboard/tenant/summary/`       | tenant | Overview for tenants                |
| `/api/dashboard/tenant/rent/`          | tenant | Rent payments                       |
| `/api/dashboard/owner/health-safety/`  | owner  | H&S documents                       |

---

## ✅ Organization Principles

### When to use `shared/` components?
- If a component is reused across roles
- If it is UI-only and generic (e.g. cards, loaders)

### When to use `owner/`, `tenant/`, etc.?
- If a component is role-specific in purpose or logic
- If dashboards differ significantly per role

### When to create `features/{module}/`?
- If functionality becomes large (e.g. Works, Finances, News)
- If logic is reused across multiple roles

---

## 🧠 Development Mantra

> “Build small, think scalable.”  
Structure your code so it’s clear **who uses it**, **why it exists**, and **where it belongs**.

Every component should have an obvious home, even if the app is still small.

---

## 📌 Future To-Dos (when scaling)

- [ ] Migrate to `features/` structure for larger modules
- [ ] Extract a full admin panel if needed
- [ ] Add API wrapper modules (`features/finances/api.js`)
- [ ] Add test coverage by role and endpoint
