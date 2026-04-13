---
name: review-proppy-skill
description: "Use when: reviewing Proppy frontend/backend feature changes before ship. Validates API contract alignment, endpoint paths, multi-tenant assumptions, UI consistency with dashboard patterns, and focused regression tests."
argument-hint: "Describe the changed feature, impacted files, expected behavior, and whether BE contract changed."
user-invocable: true
---

CRITICAL CHECKS (ALWAYS):

- KISS: no overengineering
- Backend: multi-tenant safety (company filter required)
- No API contract mismatch (endpoint, payload, response)
- Frontend must not call wrong or malformed endpoints
- TypeScript correctness (no any)

# Proppy Review Skill

Review and harden feature changes in Proppy with a repeatable, security-aware workflow.

Mode:
- Review-only by default: do not modify files unless explicitly asked.

## When to Use
- Reviewing a completed or in-progress feature before merge
- Verifying frontend API integration against Django endpoints
- Validating dashboard UI consistency (buttons, cards, row interactions, modals)
- Checking CRUD flows for blocks/properties
- Catching path bugs like duplicated API prefixes

## Inputs Expected
- Changed feature summary
- List of impacted files
- Expected user behavior
- Known backend endpoint(s)

## Procedure

1. Identify scope and affected surfaces
- Locate touched frontend files (components, hooks, types, tests)
- Locate touched backend contract files (urls, views, serializers, models) when API is involved
- Determine whether change is UI-only, FE+API, or FE+BE

2. Backend contract verification when needed (for API-related work)
- Confirm endpoint path and HTTP method in backend URL config
- Confirm payload fields accepted by serializer/model
- Confirm response shape fields used by frontend
- Confirm permission and tenant assumptions for the flow
- Resolve path composition with frontend apiClient baseURL to avoid malformed routes

When to trigger backend verification:
- Endpoint/payload mismatch suspected
- Contract ambiguity exists in frontend or backend files
- Regression appears after API path changes

Decision point:
- If frontend payload/endpoint does not match backend contract: fix frontend immediately or flag required backend change
- If backend contract is unclear or missing detail endpoint: use available list/detail source and document fallback

3. UI consistency and interaction review
- Ensure reused components and dashboard tokens are used
- Ensure action buttons remain consistent across sections (size, variants, spacing)
- Ensure row interactions and action icon clicks do not conflict (stop propagation where needed)
- Ensure details areas use clear card boundaries and structure

4. CRUD behavior checks
- Create: happy path and basic validation
- Update: field edits persist correctly
- Delete: row removal and state cleanup
- Details: data appears from valid source (detail endpoint or selected/list fallback)

5. Error/loading states
- Verify loading states disable destructive/duplicate actions
- Verify API errors are surfaced clearly in UI
- Remove noisy informational toasts unless product-relevant

6. Focused regression tests
- Add or update component-level tests for core flows only
- Mock api client and verify exact endpoint calls and payloads
- Run focused test file(s) and confirm pass

7. Final review output
- Findings first: bugs, contract mismatches, regressions, missing tests
- Then applied fixes and verification status
- Include residual risks and next optional hardening steps
- Do not suggest unnecessary refactors
- Focus on real issues, not style preferences

## Quality Gate Checklist
- Endpoint path matches backend URL exactly
- Payload fields align with serializer/model
- Response fields consumed by UI exist in backend response
- No duplicated API prefix issues
- UI styling and interaction patterns are consistent
- Core CRUD tests pass
- Multi-tenant and permission assumptions documented

## Output Template
1. Findings (ordered by severity)
2. Contract check summary
3. UI consistency summary
4. Tests added/updated and test results
5. Residual risks
Classify issues as:
- CRITICAL (breaks app or security)
- IMPORTANT (should be fixed)
- NICE TO HAVE

## Common Proppy Triggers
- "provjeri da li su polja ok"
- "uskadi formu sa backend"
- "endpoint nije dobar"
- "dodaj core testove"
- "ujednaci UI kartice i dugmad"
- "klik na red treba otvoriti details"

## Related Next Customizations
- Add a dedicated security-review skill for tenant/permission audits only
- Add a test-generation skill focused on dashboard CRUD components
- Add hooks/instructions that require contract-check section in every API-related final response
