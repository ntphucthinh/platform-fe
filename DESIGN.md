---
name: Platform Travel & Property Admin
description: Clean, calm, and functional admin design system built on MUI 9 and Refine Core
colors:
  primary: "#1976D2"
  primary-light: "#58AAF8"
  primary-dark: "#1565C0"
  secondary: "#2589F2"
  success: "#10B981"
  bg-default: "#F7F9FC"
  bg-paper: "#FFFFFF"
  text-primary: "#172033"
  text-secondary: "#64748B"
  text-disabled: "#94A3B8"
  divider: "#E7ECF2"
  action-hover: "#F1F5F9"
  action-selected: "#E5F0FD"
  header-gradient-start: "#58AAF8"
  header-gradient-end: "#2589F2"
typography:
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.bg-paper}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
  input:
    rounded: "{rounded.md}"
    height: "50px"
---

# Design System

## Overview
This design system governs the administrative interface for managing homestays, travel memories, geographical locations, and travel itineraries. Built with MUI 9 and Emotion on top of Refine Core, it balances operational speed and scanability with visual refinement.

## Colors
- **Primary Palette**: Vibrant and trustworthy blues (`#1976D2` primary, `#58AAF8` light, `#1565C0` dark).
- **Secondary Palette**: Azure blue (`#2589F2`) used for secondary controls and gradient blends.
- **Backgrounds**: Soft cool grey canvas (`#F7F9FC`) pairing with pure white cards and surfaces (`#FFFFFF`).
- **Typography & Neutral**: High-contrast slate primary text (`#172033`), muted slate secondary text (`#64748B`), and subtle dividers (`#E7ECF2`).
- **Semantic Accents**: Success emerald (`#10B981`), error crimson (`#DC2626`), and soft state chips (`#EFF6FF` for info/active).

## Typography
- **Primary Typeface**: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- **Headings**: Semi-bold (`fontWeight: 600`), tight line heights, natural letter-spacing.
- **Body & Labels**: `0.875rem` to `1rem` base sizes. Form labels and table cells maintain consistent 1.4375em line heights.
- **Captions & Metadata**: `0.75rem` (`fontWeight: 500`) for helper texts and badges.

## Layout
- **Admin Shell**: Responsive `AdminLayout` featuring:
  - Sticky header (`MuiAppBar`) with subtle gradient `#58AAF8` → `#2589F2`.
  - Permanent sidebar drawer on desktop (`md+`), collapsible drawer on mobile.
  - Page title context managed via `<HeaderTitle>`.
- **Grid Structure**: 12-column responsive MUI `Grid` with standardized spacing (`gap: 2` to `2.5`).

## Elevation & Depth
- **Restraint Over Drama**: Flat surfaces with subtle borders (`1px solid #E2E8F0` or `#E7ECF2`).
- **Cards**: Subtle box shadow `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)` with no border.
- **Dialogs & Modals**: Soft elevation 24 with backdrop blur.

## Shapes
- **Standard Radius**: `8px` (`borderRadius: 8`) for buttons, form inputs (`MuiOutlinedInput`, `DatePicker`), chips, and table containers.
- **Cards & Dialogs**: `12px` to `14px` for prominent content cards and image previews.

## Components
- **Buttons**: Flat design, `textTransform: 'none'`, `fontWeight: 600`, zero default shadow.
- **Form Controls**: Outlined inputs standardized at `50px` height (`MuiOutlinedInput`, `TextField`, `DatePicker`), matching border radius of `8px`.
- **DataGrid Tables**: Reusable `tableSx` styling with clean zebra/hover states, sticky pagination, and customized empty states.
- **Badges & Chips**: Soft pastel backgrounds (`#EFF6FF` for blue chips, `#F8FAFC` for neutral) with high-contrast text.

## Do's and Don'ts
### Do:
- Use Refine built-in hooks and custom hooks for all data fetching and mutations.
- Reuse palette tokens (`primary.main`, `text.secondary`, `background.paper`).
- Standardize text fields and date pickers at `50px` height.
- Provide clear empty and fallback states for images and collections.

### Don't:
- Don't use heavy colored accent side-tabs (e.g. `borderLeft: 4px solid ...`) on generic cards.
- Don't call `fetch` or `axios` directly in pages or components.
- Don't use generic or garish purple gradients; adhere to the blue identity.
- Don't use inline hardcoded colors when palette tokens exist.
