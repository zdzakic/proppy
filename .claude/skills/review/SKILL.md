---
name: review
description: >
  Koristi prije merge-a ili shipa — provjera bugova, API contract,
  multi-tenant sigurnosti, UI konzistentnosti. Trigeri: "review", "provjeri",
  "uskladi", "endpoint ispravan", "spreman za merge", "ship"
---

## Mod

Read-only — ne mijenjaj fajlove osim ako eksplicitno traženo.

## Redosljed provjere

1. **Scope** — koji fajlovi, koji flow, je li API uključen?

2. **API contract** (samo ako je API promijenjen)
   - Endpoint path + HTTP metoda poklapaju se FE i BE?
   - Payload polja postoje u serializeru?
   - Response polja koja FE koristi postoje u odgovoru?
   - Nema `/api/api` duplikacije u path-u?

3. **Multi-tenant** — je li svaki queryset scopovan po `company`?

4. **UI** — konzistentnost sa dashboard pattern-ima, stop propagation na action ikonama

5. **CRUD** — create/update/delete/details rade kako se očekuje

6. **Loading/error stanje** — destructive akcije disabled tokom loadinga

7. **Testovi** — postoje li testovi za core flow?

## Output format

```
CRITICAL   → sigurnost, data leak, broken flow
IMPORTANT  → funkcionalni bug, API mismatch
NICE TO HAVE → UX, konzistentnost
```

Nalazi prvo, po severity. Zatim kratki summary.
