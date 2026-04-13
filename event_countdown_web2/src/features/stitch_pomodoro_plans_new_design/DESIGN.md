# Design System Specification: High-End Editorial Productivity

This document defines the visual and structural language for a premium productivity experience. It moves away from the "utility-first" clutter of traditional task managers toward an editorial, calm, and deeply intentional interface.

---

## 1. Overview & Creative North Star: "The Silent Architect"

The Creative North Star for this design system is **"The Silent Architect."** Much like a high-end gallery or a bespoke architectural monograph, the UI does not compete for the user’s attention; it provides a serene, structured void where the user’s work can breathe.

To break the "template" look, we employ:
*   **Intentional Asymmetry:** Avoid perfectly centered grids. Use the `spacing-24` and `spacing-16` tokens to create "weighted" whitespace that guides the eye.
*   **Typographic Brutalism:** We use extreme scale—pairing `display-lg` headlines with `label-sm` metadata—to create a sophisticated, high-contrast hierarchy that feels curated rather than generated.
*   **Atmospheric Depth:** We replace lines and borders with shifts in tonal luminosity, creating a sense of physical layers.

---

## 2. Colors & Tonal Strategy

The palette is a monochromatic study in slates and deep blues, designed to reduce cognitive load and visual noise.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or grouping. Boundaries must be defined solely through background color shifts.
*   *Example:* A sidebar using `surface_container_low` should sit against a main content area of `surface`. No divider line should exist between them.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical sheets.
*   **Base Layer:** `surface` (#f7f9fb)
*   **Secondary Context:** `surface_container_low` (#f0f4f7)
*   **Interactive/Elevated Elements:** `surface_container_lowest` (#ffffff) for maximum "lift" or `surface_container_high` (#e1e9ee) for recessed depth.

### The "Glass & Gradient" Rule
To add soul to the monochromatic scheme, use **Glassmorphism** for floating overlays (e.g., Command Palettes or Popovers). 
*   **Token:** `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur.
*   **Signature Texture:** Primary actions should use a subtle linear gradient from `primary` (#565e74) to `primary_dim` (#4a5268) at a 135-degree angle to provide a satin-like finish.

---

## 3. Typography: Editorial Authority

We use two typefaces: **Manrope** for structural headlines (Geometric, Modern) and **Inter** for functional reading (Neutral, Legible).

*   **The Hero Moment (`display-lg`):** Use for empty states or dashboard greetings. Set with `-0.04em` letter spacing to feel "locked" and premium.
*   **The Functional Title (`title-lg`):** Use Inter for task names. It should feel transparent—the user should focus on the content, not the font.
*   **The Metadata (`label-sm`):** Use `on_surface_variant` (#566166) in all-caps with `0.05em` letter spacing for tags or timestamps. This creates a "caption" feel found in high-end magazines.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "digital." We achieve depth through atmospheric physics.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The contrast in luminosity (White on Off-White) creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (Modals/Menus), use an extra-diffused shadow:
    *   *Offset:* 0px 8px | *Blur:* 32px | *Color:* `on_surface` (#2a3439) at 4% opacity.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` (#a9b4b9) at **15% opacity**. This ensures the border is felt rather than seen.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_dim`. Text: `on_primary`. Radius: `md` (0.375rem). No shadow.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. 
*   **Tertiary:** Ghost style. No background. `primary` text. Transitions to `surface_container_low` on hover.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Execution:** Separate list items with `spacing-2` of vertical whitespace. On hover, apply a `surface_container_low` background with a `md` corner radius.
*   **Nesting:** Cards should use `surface_container_lowest` on a `surface` background to denote importance.

### Input Fields
*   **Styling:** No bottom line or full border. Use a subtle background fill of `surface_container_high`.
*   **Focus State:** Shift background to `surface_container_lowest` and apply a 1px "Ghost Border" using `primary` at 30% opacity.

### Navigation (The "Floating Sidebar")
*   Use a generous `spacing-8` padding from the screen edge.
*   Background: `surface_container_low`. 
*   Active State: A vertical "pill" indicator using `primary` (#565e74), but only 2px wide and height-aligned to the text, not the container.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional tool. If a screen feels cluttered, increase the spacing from `spacing-4` to `spacing-8` before removing content.
*   **DO** use "tonal pairing"—place `on_surface_variant` text on `surface_container_low` for secondary information to create a sophisticated, low-contrast aesthetic.
*   **DO** ensure all primary actions use the `primary` slate blue to provide a singular point of focus in the monochromatic sea.

### Don'ts
*   **DON'T** use pure black (#000000) for text. Always use `on_background` (#2a3439) to maintain the "Slate" softness.
*   **DON'T** use `rounded-full` for buttons unless they are icon-only. The `md` (0.375rem) or `lg` (0.5rem) radius feels more architectural and modern.
*   **DON'T** use traditional "alert red" for errors unless critical. Use `error` (#9f403d) sparingly; prioritize "calm correction" over loud warnings.