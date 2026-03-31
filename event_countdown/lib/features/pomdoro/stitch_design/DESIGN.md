# Design System Document: The Ethereal Productivity System

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Sanctuary"
This design system rejects the cluttered, high-friction nature of traditional productivity tools. Our goal is to move beyond the "app-in-a-box" aesthetic toward a **High-End Editorial** experience. We treat tasks not as chores, but as quiet focal points.

The system breaks the "template" look through **Tonal Layering** and **Intentional Breathing Room**. By utilizing a palette of atmospheric blues and off-whites, we create a UI that feels like a series of physical layers—fine paper and frosted glass—stacked purposefully to guide the eye. We prioritize white space over lines, and depth over borders, ensuring the user feels a sense of calm and clarity the moment they interact with the interface.

---

## 2. Colors

Our palette is rooted in a sophisticated range of cool tones and intentional neutrals. It is designed to feel professional yet organic.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or containers. Separation must be achieved through background color shifts. A `surface-container-low` section sitting atop a `surface` background provides all the definition needed. Boundaries should be felt, not seen.

### Surface Hierarchy & Nesting
Depth is created by nesting surface tiers. Use the following hierarchy to stack elements:
*   **Base Layer:** `surface` (#f7f9fb)
*   **Sectioning:** `surface-container-low` (#f2f4f6)
*   **Primary Interaction Cards:** `surface-container-lowest` (#ffffff)
*   **Active/Elevated States:** `surface-container-highest` (#e0e3e5)

### The "Glass & Gradient" Rule
To elevate the experience, floating elements (like FABs or Modals) should utilize semi-transparent versions of `primary` or `surface` with a **backdrop-blur** (12px–20px). Main CTAs should avoid flat fills in favor of subtle linear gradients, transitioning from `primary` (#365f82) to `primary_container` (#50789c) at a 135° angle to add "soul" and dimension.

---

## 3. Typography

We use **Manrope**, a modern sans-serif that balances geometric precision with a friendly, humanistic touch.

*   **Display (lg/md/sm):** Reserved for moments of achievement or empty states. Massive scale creates an editorial feel.
*   **Headline (lg/md/sm):** Used for page titles (e.g., "Today"). Use `on-surface` (#191c1e) with a medium weight.
*   **Title (lg/md/sm):** Specifically for task headers within cards. Bold and assertive.
*   **Body (lg/md/sm):** Optimized for readability. Secondary information, like "Zero pomodoros," should use `secondary` (#51606f) to create a clear information hierarchy against the title.
*   **Label (md/sm):** Reserved for utility—navigation tabs and small metadata.

The hierarchy is driven by **Contrast, not just size.** Use `on-surface-variant` for metadata to let the primary content sing.

---

## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` (pure white) card on a `surface` background. The subtle shift from #f7f9fb to #ffffff creates a natural, soft lift.
*   **Ambient Shadows:** If a floating action button (FAB) or modal requires a shadow, use a large blur (24px+) with a low-opacity (6%) shadow tinted with `on-surface`. Example: `box-shadow: 0 8px 24px rgba(25, 28, 30, 0.06);`.
*   **The "Ghost Border" Fallback:** If a container lacks sufficient contrast against its neighbor, use a "Ghost Border": `outline-variant` (#c2c7ce) at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** For top navigation or bottom bars, use `surface` at 80% opacity with a `backdrop-filter: blur(10px)`. This integrates the layout, letting the content scroll softly beneath the UI.

---

## 5. Components

### Cards & Lists
*   **Styling:** Use `roundedness.lg` (1rem) for all task cards.
*   **Spacing:** Use `spacing.4` (1rem) for internal padding and `spacing.3` (0.75rem) for vertical gaps between cards.
*   **Constraint:** **Prohibit dividers.** Use vertical white space to separate items.

### Buttons & FABs
*   **Primary Button:** `primary` to `primary-container` gradient. `roundedness.md` (0.75rem).
*   **Floating Action Button (FAB):** Use `primary` (#365f82) with an `on-primary` icon. Apply the **Ambient Shadow** rule.
*   **Chips/Tabs:** Use `title-sm` for tab labels. The active state is indicated by a short, thick 3px underline in `primary`, rather than a full-width line.

### Input Fields
*   **State:** Surface-level fills using `surface-container-high`.
*   **Corners:** `roundedness.md`.
*   **Focus:** Transition the "Ghost Border" from 15% to 100% `primary` opacity.

### Navigation (Bottom Bar)
*   Use `surface_container_lowest` with a subtle top "Ghost Border."
*   Icons use `on_surface_variant` for inactive states and `primary` for the active state.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., more padding at the top of a list than between items) to create an editorial rhythm.
*   **Do** leverage the full `surface` scale to create "depth zones."
*   **Do** prioritize typography scale over color variety to show importance.

### Don't
*   **Don't** use black (#000000) for text. Use `on-surface` (#191c1e) for a softer, premium feel.
*   **Don't** use hard, 1px lines to separate tasks. It creates visual noise that induces anxiety.
*   **Don't** use standard "Material Design" blue. Stick strictly to the atmospheric `primary` (#365f82).
*   **Don't** crowd the edges. If a card feels tight, increase the internal padding to `spacing.6`.