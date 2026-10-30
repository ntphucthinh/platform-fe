# Coding Conventions

# Important

## API Architecture & Data Fetching Priority

When communicating with the backend or fetching data, adhere to the following strict order of priority:

1. **Refine Built-in Hooks (Priority 1):** Always evaluate and prioritize Refine's built-in hooks first:
   - Data hooks: `useList`, `useOne`, `useMany`, `useCreate`, `useUpdate`, `useDelete`, `useCustom`, `useCustomMutation`.
   - Auth hooks: `useLogin`, `useLogout`, `useGetIdentity`, `useIsAuthenticated`, `useCheckError`.
   - Reference: [Refine Data Provider](https://refine.dev/docs/data/data-provider/) and [Refine Auth Provider](https://refine.dev/docs/authentication/auth-provider/)
2. **React Custom Hooks (Priority 2):** Create dedicated React Custom Hooks (under `src/hooks/<feature>/`) only when:
   - Built-in Refine hooks do not satisfy the requirements (e.g. non-standard workflows, specialized external data lookups, or package-level data).
   - Complex business logic, data transformations, or multi-step asynchronous processes need to be encapsulated for reuse across multiple components.
   - **No Redundant Wrappers:** Do not create a Custom Hook merely to wrap a Refine hook without adding tangible value or logic.
3. **No Services Layer (Priority 3):**
   - Do NOT implement or use a `services` layer for handling APIs.
   - All API communication, request handling, loading state, error handling, and mutations must be organized directly within hooks.

### Presentation Layer Restrictions (Components & Pages)
- Writing API call logic, `fetch`, or `axios` directly inside Components or Pages is strictly prohibited.
- Components and Pages must strictly act as a presentation layer: consume hooks and render UI.
- Never let Components or Pages manage raw HTTP requests or call lower-level network methods directly.
- Reuse hooks across components whenever multiple components share the same API or data source.

### Scope of Application
- Currently, this hook-based architecture is strictly enforced for:
  - **`auth`** (Authentication)
  - **`geo`** (Geographical and location data)
  - **`homestays`** (Homestay CRUD and media upload)
- Do not expand this scope or refactor other modules unless explicitly requested.

## Authentication (Auth) Rules

Authentication has dedicated architectural requirements:
- All authentication operations—including Login, Logout, Session Refresh, and Fetching Current User Profile—must be consumed via **Auth Hooks**.
- Prioritize integration with Refine's **Auth Provider** mechanism (`useLogin`, `useLogout`, `useGetIdentity`, `useIsAuthenticated`).
- Never call Auth APIs or service methods directly inside Pages (e.g., `src/pages/auth/login.tsx`) or Components (e.g., `Header`).
- Do not migrate Auth logic to a new services layer.
- Preserve the existing token management, CSRF handling, and session storage architecture (`src/utils/auth.ts`, `localStorage` keys, expiration checking, refresh token handling).
- Retain existing login, logout, and route protection/authorization behaviors without alteration.

## Geographical Data Rules (globalGeoService)

For geographical data previously organized under `globalGeoService`:
- Extract and expose all data fetching and lookup operations through dedicated React Custom Hooks (e.g., `useCountries`, `useStatesByCountry`, `useGlobalGeo` under `src/hooks/common/`).
- Prioritize Refine hooks if a suitable backend API endpoint is integrated in the future.
- All functionalities related to countries, states/provinces/cities, coordinates, and location mapping must be reused via hooks.
- Components and Pages must never handle HTTP requests or call data-fetching routines directly.
- Do not introduce a new services layer for this data.

## Handling Input Data

- In principle, use `react-hook-form`.
- When using MUI's `<Create>` or similar components, use `@refinedev/react-hook-form`.
- Reference: [How to use refine Create](https://refine.dev/docs/ui-integrations/material-ui/components/basic-views/create/)

## Appropriate Line Count per File

- Files exceeding 600 lines must be split:
  - Extract into components
  - Extract into custom hooks

## Refactoring Existing Screens

- In principle, existing implementations do not need to be modified, but overly complex screens must be simplified.
  - Limit component depth to: Page file → Child component → Grandchild component.

# General

- **Language:** Use TypeScript and enable strict type checking.
- **Comments:** Add comments in Japanese for complex logic and component Props. Write TODO comments in Japanese as well (`// TODO: Implementation required`).
- **Dependencies:** Before adding a new library, verify whether existing dependencies can fulfill the requirements.

## React Components

- **Function Components:** Use function components rather than class components.
- **Props:** Explicitly define Props types using TypeScript `interface`.
- **State Management:**
  - Use `useState` for simple state management.
  - Consider `react-hook-form` when multiple states are related and involve complex update logic.
- **Side Effects:**
  - In principle, include all values used inside the first argument in the dependency array (second argument) of `useEffect`.
  - Return a cleanup function for side effects that require cleanup (unsubscribing, clearing timers, etc.).
- **Event Handlers:** Memoize functions using `useCallback` when performance is a concern.
- **Conditional Rendering:**
  - For readability, choose appropriately between the ternary operator (`condition ? <A /> : <B />`), logical AND operator (`condition && <A />`), or early return (`if (!condition) return null;`).
- **List Rendering:**
  - Render lists by iterating over arrays with the `map()` method.
  - Do not use the `index` obtained from the second argument of `map()` as the `key` for list items.
- **Component Decomposition:**
  - Splitting units is acceptable as long as they are not excessively large.
  - Extract reusable UI components and logic into custom components or custom hooks.
- **Performance Optimization:**
  - Use `React.memo` to prevent re-renders when Props do not change.
  - Appropriately use `useCallback` for function memoization and `useMemo` for value memoization.
- **Styling:**
  - Use MUI components as the base.
  - Define styles within the component file or separate them into an associated `.styles.ts` file.
- **JSX:**
  - Enclose attributes in double quotes (`""`).
  - Enclose multiline JSX in parentheses (`()`).

## Criteria for Custom Hooks

- **API Organization & Data Fetching:** Encapsulate API requests, data transformations, loading, and error handling when Refine built-in hooks are not suitable.
- **Logic Reuse:** When state logic, side effect logic, or data-fetching logic is shared across multiple components.
- **Separation of Concerns:** When extracting complex business or asynchronous logic from components to improve clarity and maintainability.
- **No Boilerplate Wrapping:** Do not wrap a Refine hook in a custom hook unless additional business logic or transformations are introduced.
- **Naming Convention:** Use the `use` prefix (e.g., `useCountries`, `useStatesByCountry`, `useModalState`).

## Handling Input Data (Forms)

- In principle, use **react-hook-form** for forms such as search, create, and edit.
- When integrating with MUI components, use the `Controller` component.
- Define validation rules using the second argument of react-hook-form's `register` function.
- Leverage react-hook-form APIs (`handleSubmit`, `watch`, `formState`, etc.) for form state management and submission processing.

## File / Folder Structure

- **Components:**
  - Page-specific components: `src/components/pages/`
    - Components: UpperCamelCase (PascalCase) file names
    - Custom hooks: File names starting with `use...` (e.g., `useXxx`)
    - Others: lowerCamelCase file names
- **Pages:** Place route-level components under `src/pages/`.
- **Hooks:** Place custom hooks organized by feature or common domain under `src/hooks/<feature>/` or `src/hooks/common/` (e.g., `src/hooks/auth/`, `src/hooks/common/`).
- **Type Definitions:**
  - Global types: Place under `src/types/`.
  - Feature-specific types: Place under `src/types/pages/<feature>/` or `src/types/<feature>/`.
- **Utilities:** Place general-purpose utility functions under `src/utils/`.
