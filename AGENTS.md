# AGENTS.md

The primary coding standards are defined in `docs/coding-conventions.md`. This file contains the operational rules that all AI agents must follow.

## Project Overview

This is a Vite React admin UI scaffold. API communication and data fetching are organized via Refine built-in hooks and feature-based React Custom Hooks in `src/hooks/<feature>/`. Refine's `routerProvider` and `authProvider` manage routing and authentication. Components and pages never call APIs directly; no `services` layer is used.

## Tech Stack

- React 19 + TypeScript 6 (strict)
- Vite 8
- Refine core with the React Router integration and Refine MUI error component
- React Router DOM 7
- MUI 9, MUI X Data Grid, Emotion, and Sass
- React Hook Form + Yup (`@hookform/resolvers`)
- Impeccable (Design system & UI anti-pattern detection via `PRODUCT.md` and `DESIGN.md`)

## Project Structure

- `PRODUCT.md` — Product vision, target personas, design principles, and boundaries.
- `DESIGN.md` — Design system specs, color tokens, typography, component rules, and anti-patterns.
- `src/providers/routerProvider.tsx` — application providers, Refine setup, and route tree.
- `src/providers/authProvider.ts` — Refine `authProvider` implementation bridging authentication hooks and session state.
- `src/router/resources.ts` — Refine resource metadata.
- `src/pages/<feature>/` — route-level pages; user list/create/edit are the example.
- `src/components/pages/<feature>/` — reusable feature UI, such as `UserForm`.
- `src/components/ui/` — shared layout, header, sidebar, and table UI.
- `src/components/theme/` and `src/theme/` — MUI provider, theme, palette, and component overrides.
- `src/schemas/<feature>/` — Yup validation schemas for the corresponding feature.
- `src/hooks/<feature>/` and `src/hooks/common/` — React custom hooks organized by domain/feature (e.g., `src/hooks/auth/`, `src/hooks/common/`).
- `src/types/pages/<feature>/` — TypeScript interfaces and types used by route-level pages and their forms.
- `src/types/ui/` and `src/types/theme/` — shared UI-context and theme-layout interfaces.
- `src/constants/` — local shared constants and mock data.
- `src/config/env.ts` — typed access point currently exposing Vite env values.

## Core Development Rules

- Preserve `strict`, `noUnusedLocals`, and `noUnusedParameters`; do not disable TypeScript or ESLint checks.
- Do not use `any` or `as any`. Handle caught errors as `unknown` and narrow them before reading fields.
- Follow the strict API hierarchy: 1) Refine built-in hooks, 2) React Custom Hooks (in `src/hooks/<feature>/`), 3) No `services` layer. Never write direct API calls (`fetch`/`axios`) or invoke service methods directly inside components or pages.
- The hook-based API architecture is currently strictly enforced for `auth`, `geo`, and `homestays`. Do not expand this scope or arbitrarily refactor other existing modules without an explicit requirement.
- Reuse existing domain types, shared UI, schemas, theme, and routes before adding equivalents.
- Keep unrelated generated/starter assets and legacy SCSS untouched unless the requested change concerns them.

## API Architecture & Hook Conventions

When communicating with backend APIs or fetching data:

1. **Priority 1: Refine Built-in Hooks**
   - Always evaluate and prioritize Refine's built-in hooks first:
     - Data hooks: `useList`, `useOne`, `useMany`, `useCreate`, `useUpdate`, `useDelete`, `useCustom`, `useCustomMutation`.
     - Auth hooks: `useLogin`, `useLogout`, `useGetIdentity`, `useIsAuthenticated`, `useCheckError`.
   - Do NOT create a custom hook merely to wrap a Refine hook without adding tangible value or logic.
2. **Priority 2: React Custom Hooks**
   - Create custom hooks under `src/hooks/<feature>/` only when Refine hooks do not satisfy the use case (e.g., package-level data, specialized external lookups) or when complex business logic and data transformations need encapsulation for reuse.
   - Encapsulate request handling, data mapping, loading state, error handling, and mutation state inside the hook.
   - Components and Pages must strictly act as a presentation layer: consume hooks and render UI. No direct `fetch`, `axios`, or service calls in components/pages.
   - Reuse hooks across components whenever multiple components share the same API or data source.
3. **Priority 3: No Services Layer**
   - Do NOT implement or use a `services` layer for handling APIs. All API communications must be organized via Refine Hooks or React Custom Hooks directly.
4. **Scope of Application**
   - Currently strictly enforced for:
     - `auth` (Authentication)
     - `geo` (Geographical data)
     - `homestays` (Homestay CRUD and media uploads)
   - Do not refactor other modules unless explicitly requested.

### Authentication (Auth) Rules
- Login, Logout, Session Refresh, and User Profile retrieval must be handled via Auth Hooks.
- Prioritize integration with Refine's `authProvider` (`useLogin`, `useLogout`, `useGetIdentity`, `useIsAuthenticated`).
- Never call Auth APIs or service methods directly inside Pages or Components.
- Do not migrate Auth logic to a new services layer.
- Preserve existing token management, CSRF token handling, and session persistence in `src/utils/auth.ts` (`localStorage` keys, expiration checks, refresh tokens).
- Maintain existing login, logout, and route authorization behaviors without alteration.

### Geographical Data Rules (globalGeoService)
- Extract and expose all geographical data (countries, provinces/states, coordinates, location helpers) via React Custom Hooks under `src/hooks/common/` (e.g., `useCountries`, `useStatesByCountry`, `useGlobalGeo`).
- Prioritize Refine hooks if a backend API becomes available; otherwise use custom hooks with package/cached data.
- Components and Pages must not execute HTTP requests or invoke service methods directly.
- Do not create an additional services layer for this data.

## Naming and TypeScript

- Use camelCase filenames and lower-case feature folders, following `userForm.tsx`, `headerTitle.tsx`, and `pages/users/`.
- Components and exported type names use PascalCase.
- Interfaces follow the existing feature convention. Existing form/domain interfaces use an `I` prefix, such as `IUserFormData`; preserve this convention when adding related interfaces.
- Use camelCase variables/functions, SCREAMING_SNAKE_CASE for constants (`MOCK_USERS`, `ROLE_OPTIONS`), and string-literal unions for the current role/status domains. There are no enums in the codebase.
- Type imports use `import type`. Use the concrete types supplied by dependencies (for example `GridColDef<UserItem>`).

## Type and Interface Rules

- Put page-specific interfaces and types in `src/types/pages/<feature>/`. Put form-specific definitions in that feature's type file when they only serve that page or feature.
- Reuse an existing interface or type before creating one. Do not duplicate the same object contract across files.
- Use `interface` for object contracts when that is the convention of the nearby feature; use `type` for unions, aliases, and composed types where appropriate.
- Preserve the local `I`-prefixed form/domain interface convention where it exists; do not apply it to unrelated interfaces solely for consistency.
- Type-only imports must use `import type`.

Current form type flow:

```text
src/types/pages/auth/login.ts
  ILoginFormData
    → src/schemas/auth/loginSchema.ts: ObjectSchema<ILoginFormData>
      → src/pages/auth/login.tsx: useForm<ILoginFormData>()

src/types/pages/users/user.ts
  IUserFormData
    → src/schemas/users/userSchema.ts: ObjectSchema<IUserFormData>
      → src/components/pages/users/userForm.tsx: useForm<IUserFormData>()
```

## Imports

- Use the configured `@/` alias for internal imports; it is the alias used throughout source. Although `~/` is configured in TypeScript, it is not used by the application—do not introduce it.
- Keep third-party imports before internal imports. Follow the surrounding file's quote and semicolon style; the source is not fully uniform.

## React, Layout, and State

- Use function components. Pages set their title with `<HeaderTitle>…</HeaderTitle>` inside the page content.
- Auth is not enforced on public routes: `/login` is a standalone route; admin routes render within `AdminLayout`. Preserve this route/layout split.
- Use React Router's `useNavigate`/`useParams` for current imperative navigation and URL parameters.
- Use local `useState` for page/component state. The only shared client state is `HeaderTitleContext`; do not add a state library without a concrete project need.
- Keep responsive layout behavior in `AdminLayout`/`Sidebar` (MUI breakpoints, permanent desktop drawer and temporary mobile drawer).

## Refine and Routing

- Keep Refine configured in `AppProvider` with `routerProvider`, `authProvider`, `resources`, and `syncWithLocation: true`.
- When adding a managed resource, update both `src/router/resources.ts` and the nested routes in `routerProvider.tsx`; update sidebar navigation when it should be visible.
- Leverage Refine data hooks and auth hooks (`useLogin`, `useLogout`, `useGetIdentity`) where applicable.
- Keep the admin catch-all route using Refine's `ErrorComponent`; use `Navigate` for intentional redirects such as the users index/settings behavior.

## UI and MUI

- Build UI from MUI components and `sx` props, as existing pages do. Reuse `CustomThemeProvider`, `appTheme`, and palette tokens (`primary.main`, `text.secondary`, `background.*`) where suitable.
- Adhere to the design system and tokens specified in `PRODUCT.md` and `DESIGN.md`. Avoid generic AI anti-patterns (such as arbitrary gradient glows, missing visual hierarchy, unnecessary card wrapping, low-contrast text, or inconsistent border radiuses).
- Use the Impeccable skill (`/impeccable polish`, `/impeccable critique`, `/impeccable audit`) when creating or refining UI components to ensure professional polish and craft.
- Extend global visual defaults in `src/theme/theme.ts`/`lightTheme.ts`, not by duplicating broad overrides in each feature. Local `sx` is appropriate for feature-specific layout/detail styling.
- Reuse `AdminLayout`, `Header`, `Sidebar`, and `HeaderTitle`; do not recreate a feature-local shell.
- For admin tables, use `DataGrid` with typed columns and reuse `tableSx` from `components/ui/table/tableStyles.ts`. Preserve its paging, non-selectable rows, and custom no-results pattern unless requirements differ.

## Forms and Validation

- Use React Hook Form with a typed `useForm<T>` and a Yup schema via `yupResolver`.
- Keep schemas in `src/schemas/<feature>/` paired with their feature type, and type them as `ObjectSchema<T>`.
- Bind MUI fields through `register`, show `errors.field?.message`, provide `defaultValues`, and submit using `handleSubmit` with `noValidate`.
- Keep reusable form presentation in `components/pages/<feature>/`; route pages own navigation, data lookup, and submit/cancel behavior.

## Data, Errors, and Environment

- `MOCK_USERS` in `src/constants/user.ts` is the present users data source. Treat it as read-only fixture data unless the task explicitly adds a state/API flow.
- Existing error UI is an inline MUI `Alert` on login. For new async flows, clear prior error before retry, render user-facing error feedback, and narrow unknown errors safely.
- Read Vite settings through `env` in `src/config/env.ts`. Use only `VITE_*` values; never commit `.env` files.

## Validation Commands

```bash
npm run lint
npm run build
npm run impeccable:detect
```

There is no configured test runner. Run the relevant manual UI flow when changing routes, responsive layout, forms, or the DataGrid.

## Definition of Done

- New files are placed in the appropriate feature/shared layer and imports use `@/`.
- Routes, Refine resources, and sidebar entries agree when a navigable resource changes.
- Forms have matching typed schema, defaults, validation messages, and submit/cancel behavior.
- UI follows the shared theme/layout/table patterns, aligns with `DESIGN.md`, and works at mobile and desktop breakpoints where relevant.
- API calls and data fetching follow the Refine hooks -> Custom Hooks priority; no direct API calls or service invocations in components/pages.
- Auth, geo, and homestays conform to the hook-based architecture.
- `npm run lint`, `npm run build`, and `npm run impeccable:detect` pass.
