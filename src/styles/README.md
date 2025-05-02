# Design System Tokens

This document outlines the design tokens used in our application. These tokens provide a consistent foundation for our UI components.

## Colors

### Brand Colors
- `primary`: Our main brand color with 10 shades (50-900)
  - `primary-500`: Main primary color (#1a7fff)
  - Used for primary actions, links, and brand elements

### Semantic Colors
- `success`: For positive states (50, 500, 700)
- `warning`: For cautionary states (50, 500, 700)
- `error`: For error states (50, 500, 700)
- `info`: For informational states (50, 500, 700)
- `neutral`: For grayscale needs (50-900)

### UI Colors
- `surface`: Background colors (50-400)
- `content`: Text and content colors (50-400)

## Spacing

Our spacing system uses a base unit of 4px (0.25rem):

```css
3xs: 2px   (0.125rem)
2xs: 3px   (0.1875rem)
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

## Typography

### Font Families
- `sans`: Inter var, system-ui, sans-serif
- `mono`: JetBrains Mono, monospace

### Font Sizes
Each size includes font size and line height:

```css
xs:   12px/16px
sm:   14px/20px
base: 16px/24px
lg:   18px/28px
xl:   20px/28px
2xl:  24px/32px
3xl:  30px/36px
4xl:  36px/40px
```

### Font Weights
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700

## Border Radius

```css
none: 0
xs:   4px   (0.25rem)
sm:   6px   (0.375rem)
md:   8px   (0.5rem)
lg:   12px  (0.75rem)
xl:   16px  (1rem)
full: 9999px
```

## Shadows

```css
none: none
sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05)
md:   0 4px 6px -1px rgba(0, 0, 0, 0.1)
lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1)
xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1)
inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)
```

## Animation

### Timing Functions
```css
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
ease-out:    cubic-bezier(0, 0, 0.2, 1)
ease-in:     cubic-bezier(0.4, 0, 1, 1)
```

### Durations
```css
75:   75ms
100:  100ms
150:  150ms
200:  200ms
300:  300ms
500:  500ms
700:  700ms
1000: 1000ms
```

## Usage Guidelines

1. **Colors**
   - Use semantic colors for their intended purposes
   - Stick to the defined color scales
   - Use surface/content colors for UI elements

2. **Spacing**
   - Use the spacing scale for consistent layouts
   - Prefer named tokens over arbitrary values
   - Use smaller increments (3xs, 2xs) for fine-tuning

3. **Typography**
   - Use the defined font families
   - Follow the type scale for consistent hierarchy
   - Use appropriate line heights

4. **Border Radius**
   - Use consistent border radius values
   - Match radius to component size
   - Use `full` for pill-shaped elements

5. **Shadows**
   - Use shadows to indicate elevation
   - Match shadow intensity to importance
   - Use `inner` for inset elements

6. **Animation**
   - Use standard timing functions
   - Keep animations short and purposeful
   - Use consistent durations 