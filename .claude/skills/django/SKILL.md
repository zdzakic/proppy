---
name: django
description: >
  Koristi za Django/DRF backend rad u Proppyu — modeli, serializers, views,
  permissions, migracije. Trigeri: "dodaj endpoint", "novi model", "backend",
  "API", "migracija", "serializer", "permission"
---

## Proppy-specifična pravila

- UVIJEK filtriraj po `company` — nikad `objects.all()` bez scopinga
- Tenant protection ide kroz `get_queryset()`, ne u view logici
- `company` se assignuje iz `request.user`, nikad iz client inputa
- Role check: `request.user.roles` (lista), nikad `request.user.role`
- Permisije u `permissions.py`, nikad inline u viewu
- Validacija u serializeru, nikad u viewu
- Default za POST/PATCH/DELETE: `COMPANYADMIN` only, osim ako eksplicitno drugačije

## Redosljed za novi endpoint

1. Provjeri postoji li sličan pattern u codebaseu — rekoristi
2. Model → serializer → generic view → URL → test tenant isolation
3. Vrati: serializer + view + url zajedno

## Struktura projekta

- `users/` → auth, roles, permissions
- `properties/` → core domain, plaćanja
- `core/` → shared logika, paginacija
- `dashboard/` → agregati
- `settings/base.py` + `dev.py` + `prod.py`

## Prije završetka

Provjeri: može li user iz Company A pristupiti podacima Company B?
