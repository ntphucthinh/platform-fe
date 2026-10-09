# AGENTS.md

## Project Overview

This is a Vite React admin UI scaffold. It currently renders local/mock data; it does not yet have a Refine `dataProvider`, `authProvider`, API/service layer, custom hooks directory, or test configuration.

## Tech Stack

- React 19 + TypeScript 6 (strict)
- Vite 8
- Refine core with the React Router integration and Refine MUI error component
- React Router DOM 7
- MUI 9, MUI X Data Grid, Emotion, and Sass
- React Hook Form + Yup (`@hookform/resolvers`)

## Project Structure

- `src/providers/routerProvider.tsx` — application providers, Refine setup, and route tree.
- `src/router/resources.ts` — Refine resource metadata.
- `src/pages/<feature>/` — route-level pages; user list/create/edit are the example.
- `src/components/pages/<feature>/` — reusable feature UI, such as `UserForm`.
- `src/components/ui/` — shared layout, header, sidebar, and table UI.
- `src/components/theme/` and `src/theme/` — MUI provider, theme, palette, and component overrides.
- `src/schemas/<feature>/` — Yup validation schemas for the corresponding feature.

- `src/types/pages/<feature>/` — TypeScript interfaces and types used by route-level pages and their forms. Current feature files are `src/types/pages/auth/login.ts` for the login page/form and `src/types/pages/users/user.ts` for user forms/pages.

- `src/types/ui/` and `src/types/theme/` — shared UI-context and theme-layout interfaces.
- `src/constants/` — local shared constants and mock data.
- `src/config/env.ts` — typed access point currently exposing Vite env values.

## Core Development Rules

- Preserve `strict`, `noUnusedLocals`, and `noUnusedParameters`; do not disable TypeScript or ESLint checks.
- Do not use `any` or `as any`. Handle caught errors as `unknown` and narrow them before reading fields.
- Reuse existing domain types, shared UI, schemas, theme, and routes before adding equivalents.
- The UI is intentionally mock-driven today. Do not assume API, authentication, persistence, notifications, or deletion behavior exists. When introducing one, add the required provider/service and integrate it deliberately rather than leaving `console.log` placeholders.
- Keep unrelated generated/starter assets and legacy SCSS untouched unless the requested change concerns them.

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
- Auth is not enforced: `/login` is a standalone route; other routes render within `AdminLayout`. Preserve this route/layout split.
- Use React Router's `useNavigate`/`useParams` for current imperative navigation and URL parameters.
- Use local `useState` for page/component state. The only shared client state is `HeaderTitleContext`; do not add a state library without a concrete project need.
- Keep responsive layout behavior in `AdminLayout`/`Sidebar` (MUI breakpoints, permanent desktop drawer and temporary mobile drawer).

## Refine and Routing

- Keep Refine configured in `AppProvider` with `routerProvider`, `resources`, and `syncWithLocation: true`.
- When adding a managed resource, update both `src/router/resources.ts` and the nested routes in `routerProvider.tsx`; update sidebar navigation when it should be visible.
- Reuse Refine router integration and existing resource metadata. Do not claim Refine CRUD/data hooks are wired until a real data provider is added.
- Keep the admin catch-all route using Refine's `ErrorComponent`; use `Navigate` for intentional redirects such as the users index/settings behavior.

## UI and MUI

- Build UI from MUI components and `sx` props, as existing pages do. Reuse `CustomThemeProvider`, `appTheme`, and palette tokens (`primary.main`, `text.secondary`, `background.*`) where suitable.
- Extend global visual defaults in `src/theme/theme.ts`/`lightTheme.ts`, not by duplicating broad overrides in each feature. Local `sx` is appropriate for feature-specific layout/detail styling.
- Reuse `AdminLayout`, `Header`, `Sidebar`, and `HeaderTitle`; do not recreate a feature-local shell.
- For admin tables, use `DataGrid` with typed columns and reuse `tableSx` from `components/ui/table/tableStyles.ts`. Preserve its paging, non-selectable rows, and custom no-results pattern unless requirements differ.

## Forms and Validation

- Use React Hook Form with a typed `useForm<T>` and a Yup schema via `yupResolver`.
- Keep schemas in `src/schemas/<feature>/` paired with their feature type, and type them as `ObjectSchema<T>`.
- Bind MUI fields through `register`, show `errors.field?.message`, provide `defaultValues`, and submit using `handleSubmit` with `noValidate`.
- Keep reusable form presentation in `components/pages/<feature>/`; route pages own navigation, data lookup, and submit/cancel behavior.

## Data, Errors, and Environment

- `MOCK_USERS` in `src/constants/userConstants.ts` is the present users data source. Treat it as read-only fixture data unless the task explicitly adds a state/API flow.
- Existing error UI is an inline MUI `Alert` on login. For new async flows, clear prior error before retry, render user-facing error feedback, and narrow unknown errors safely.
- Read Vite settings through `env` in `src/config/env.ts`. Use only `VITE_*` values; never commit `.env` files.

## Validation Commands

```bash
npm run lint
npm run build
```

There is no configured test runner. Run the relevant manual UI flow when changing routes, responsive layout, forms, or the DataGrid.

## Definition of Done

- New files are placed in the appropriate feature/shared layer and imports use `@/`.
- Routes, Refine resources, and sidebar entries agree when a navigable resource changes.
- Forms have matching typed schema, defaults, validation messages, and submit/cancel behavior.
- UI follows the shared theme/layout/table patterns and works at mobile and desktop breakpoints where relevant.
- `npm run lint` and `npm run build` pass.
