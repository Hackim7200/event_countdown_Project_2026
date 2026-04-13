# Design System Specification

## 1. Overview & Creative North Star

### The Creative North Star: "The Monolith"
This design system is built upon the concept of **The Monolith**—an architectural philosophy that prioritizes structural integrity, purposeful silence, and the weight of intentionality. Unlike standard "productivity" apps that lean on colorful gamification, this system treats a task list like a blueprint. It is designed to recede into the background, providing a monumental frame for the user’s work without ever competing for attention.

The system breaks the "template" look by utilizing extreme typographic scale contrasts, intentional asymmetry in layout (such as the right-aligned secondary navigation vs. left-aligned headers), and a rejection of traditional UI scaffolding like borders and shadows. The interface is not a set of boxes; it is a series of planes.

---

## 2. Colors

The palette is a sophisticated grayscale study designed to mimic natural light hitting varying architectural surfaces.

*   **Primary (`#5c5f61`) / Primary Container (`#e1e3e5`):** Used for structural emphasis and active states.
*   **Surface Hierarchy:**
    *   **Surface (`#f8f9fa`):** The base "foundation."
    *   **Surface-Container-Low (`#f1f4f6`):** For subtle sectioning.
    *   **Surface-Container-Lowest (`#ffffff`):** For elevated interactive elements (cards).
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined solely through background color shifts. If an element needs to stand out, it should sit as a `surface-container-lowest` card against a `surface` or `surface-container-low` background.
*   **Surface Hierarchy & Nesting:** Depth is achieved through "tonal nesting." To indicate importance, move from darker surfaces to lighter ones (e.g., a white card on a light gray background). This creates a "rising" effect toward the user.
*   **The "Glass & Gradient" Rule:** Floating elements, such as the bottom-right FAB or specific overlays, should utilize Glassmorphism. Use `surface` colors at 80% opacity with a `20px` backdrop blur to integrate the element into the environment rather than "sticking" it on top.
*   **Signature Textures:** For the main Timer CTA or active execution states, use a subtle linear gradient from `primary` (`#5c5f61`) to `primary_dim` (`#505355`) to provide a tactile, metallic density.

---

## 3. Typography

The typographic system relies on the interplay between the structural, geometric **Manrope** and the utilitarian, precise **Inter**.

*   **Display (Manrope):** Massive, heavy-weight displays (`display-lg` at 3.5rem) are used for "Momentum Headers" like "Today" or "25:00." They act as architectural anchors.
*   **Headlines (Manrope):** Used for page titles and section headers. High-contrast sizing creates a clear editorial hierarchy.
*   **Body & Labels (Inter):** All functional data, task descriptions, and meta-info use Inter. This ensures high legibility even at the `body-sm` (0.75rem) level.
*   **The Intentional Void:** Large amounts of letter-spacing (0.05em) should be applied to `label-md` and uppercase text to evoke a sense of high-end gallery labeling.

---

## 4. Elevation & Depth

This system rejects the "card-on-gray-shadow" trope in favor of **Tonal Layering**.

*   **The Layering Principle:** Place `surface-container-lowest` (#ffffff) cards on a `surface` (#f8f9fa) background. The 1.5% difference in luminance is enough to define a boundary without visual noise.
*   **Ambient Shadows:** For floating elements (like the FAB), use an extra-diffused "Atmospheric Shadow":
    *   `box-shadow: 0 20px 40px rgba(43, 52, 55, 0.06);`
    *   Never use pure black; always tint the shadow with the `on_surface` color for a natural, ambient light look.
*   **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use `outline_variant` at 20% opacity. It should be felt, not seen.
*   **Focus State:** Active cards (like the "Currently Focusing" task) should be defined by an `outline` token at 100% opacity or a subtle shift to `primary_container` rather than a shadow.

---

## 5. Components

### Cards & Task Blocks
*   **Style:** No borders. Use `surface-container-lowest` fill. 
*   **Spacing:** Enforce high vertical padding (24px) to give content "breathing room."
*   **Separation:** Forbid the use of divider lines. Separate tasks using 16px of vertical white space or a transition from one surface tone to another.

### Pomodoro Progress Indicators
*   **Style:** Horizontal pill shapes (`rounded-full`). 
*   **States:** Use `primary` for completed sessions, `primary_container` for upcoming sessions, and `outline_variant` for empty slots.

### Timer Interface
*   **Primary CTA:** Large, rounded buttons (`rounded-lg`) using `primary` or `primary_container`.
*   **Typography:** The countdown must be `display-lg` in Manrope, centered, acting as the visual centerpiece of the screen.

### Navigation Tabs
*   **Global Nav:** Uppercase `label-md` with an `8px` underline on the active state. The underline should be placed `12px` below the baseline to prevent typographic crowding.
*   **Contextual Nav:** (e.g., Today/Tomorrow) Right-aligned, using `title-sm` with a thicker `2px` underline for the active state.

---

## 6. Do's and Don'ts

### Do
*   **Do use asymmetrical layouts.** Align the main heading to the left and secondary filters to the right to create dynamic tension.
*   **Do lean on "The Void."** Use excessive white space (64px+) between major sections to enforce focus.
*   **Do use "Surface-Tint."** Use the tint token for subtle iconography or inactive icons to keep them within the same tonal family.

### Don't
*   **Don't use 1px solid lines.** They "break" the architectural feel and make the app look like a standard spreadsheet.
*   **Don't use vibrant colors.** Outside of the `error` state (which should be a muted, architectural red), stick strictly to the grayscale tokens provided.
*   **Don't use standard drop shadows.** If it looks like it’s "floating" on a webpage, it’s too heavy. It should look like it’s part of the physical plane.