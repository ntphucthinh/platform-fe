# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Platform administrators, homestay operators, and tourism managers managing property listings, travel maps, travel memories (kỷ niệm chuyến đi), and itineraries.

## Product Purpose

A modern web-based administration dashboard and travel management platform for managing homestay accommodations, geographical destinations, interactive travel maps with Vietnam sovereignty compliance, travel memory photo journals, and multi-day travel itineraries.

## Positioning

A unified travel and property admin portal with a strict hook-based architecture (Refine built-in hooks + React custom hooks), interactive Leaflet map with verified sovereignty borders, and responsive admin UI.

## Operating Context

Desktop and mobile-responsive backoffice environment. Used for inventory curation, content publishing, multi-photo journaling, and itinerary planning.

## Capabilities and Constraints

- **Capabilities**: Homestay management (CRUD, gallery uploads), travel map locations & visited spots, travel memories with daily photo albums, travel itineraries with timeline activities, user access management.
- **Architectural Rules**: Strict hierarchy (Refine hooks > React Custom Hooks > No services layer in UI components).
- **Sovereignty Compliance**: Complete display of Vietnamese territory including Hoàng Sa and Trường Sa archipelagoes.

## Brand Commitments

- Clean, functional, and polished admin interface.
- Visual language: Modern blue tones (`#1976D2`, `#2589F2`, `#58AAF8`), crisp light surfaces (`#F7F9FC`, `#FFFFFF`), and slate typography (`#172033`, `#64748B`).

## Evidence on Hand

- Complete source tree in `src/` with Material UI 9, Refine Core, React Router DOM 7.
- Visual token definitions in `src/theme/theme.ts` and `src/theme/lightTheme.ts`.

## Product Principles

1. **Task-First Clarity (Operate Mode)**: High scanability, consistent data grids, robust responsive layouts.
2. **Hook-Based Separation of Concerns**: Components are pure presentation layers; all API communication goes through Refine or domain hooks.
3. **Reliable Validation & Safe Fallbacks**: Typed Yup validation, neutral default states, and defensive error handling.
