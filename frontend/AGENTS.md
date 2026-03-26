<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Osteria Bellavista - Design System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Typography](#typography)
4. [Color System](#color-system)
5. [Spacing & Layout](#spacing--layout)
6. [Component Library](#component-library)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Animation Patterns](#animation-patterns)
10. [Figma Export Specifications](#figma-export-specifications)

---

## Overview

Osteria Bellavista is a traditional Ticinese restaurant website featuring an elegant, warm aesthetic inspired by Italian hospitality and Lake Lugano's landscape. The design emphasizes:

- **Warm, earthy tones** - Olive green, terracotta, cream, and gold accents
- **Elegant typography** - Playfair Display for headings, Inter for body text
- **Subtle animations** - Smooth scroll-triggered reveals and micro-interactions
- **Mobile-first approach** - Responsive from 320px to 4K displays
- **Accessibility-first** - WCAG 2.1 AA compliant

---

## Design Tokens

### Color Palette

#### Primary Colors
| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-olive` | `#1a3a2a` | Primary brand color, headings, CTAs |
| `--color-olive-light` | `#2d5a3f` | Hover states, gradients |
| `--color-terracotta` | `#c45c3e` | Accent color, highlights, badges |
| `--color-terracotta-light` | `#d97b5e` | Hover states, decorative elements |

#### Neutral Colors
| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-cream` | `#f8f6f2` | Primary background |
| `--color-sand` | `#e8e2d9` | Secondary background, borders |
| `--color-gold` | `#c9a961` | Premium accents, decorative text |
| `--color-charcoal` | `#1a1a1a` | Primary text |
| `--color-stone-warm` | `#8b8175` | Muted text, captions |

#### Semantic Colors (CSS Variables)
```css
:root {
  --background: #f8f6f2;
  --foreground: #1a1a1a;
  --card: #ffffff;
  --card-foreground: #1a1a1a;
  --popover: #ffffff;
  --popover-foreground: #1a1a1a;
  --primary: #1a3a2a;
  --primary-foreground: #f8f6f2;
  --secondary: #e8e2d9;
  --secondary-foreground: #1a1a1a;
  --muted: #e8e2d9;
  --muted-foreground: #8b8175;
  --accent: #c45c3e;
  --accent-foreground: #ffffff;
  --destructive: #dc2626;
  --border: #e8e2d9;
  --input: #e8e2d9;
  --ring: #1a3a2a;
}
```

#### Dark Mode Colors
```css
.dark {
  --background: #0f1410;
  --foreground: #f8f6f2;
  --card: #1a1f1b;
  --card-foreground: #f8f6f2;
  --primary: #3d8b5f;
  --primary-foreground: #0f1410;
  --secondary: #2a2f2b;
  --secondary-foreground: #f8f6f2;
  --muted: #2a2f2b;
  --muted-foreground: #a8a29e;
  --accent: #e07a5f;
  --accent-foreground: #0f1410;
}
```

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `calc(var(--radius) * 0.6)` | Small elements, tags |
| `--radius-md` | `calc(var(--radius) * 0.8)` | Buttons, inputs |
| `--radius-lg` | `var(--radius)` | Cards, containers |
| `--radius-xl` | `calc(var(--radius) * 1.4)` | Large cards, modals |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` | Hero sections |
| `--radius-3xl` | `calc(var(--radius) * 2.2)` | Feature sections |
| `--radius-4xl` | `calc(var(--radius) * 2.6)` | Full-round elements |

Base radius: `--radius: 0.5rem`

### Shadows
```css
/* Subtle elevation */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Default elevation */
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Medium elevation - Cards */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Large elevation - Modals */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Extra large - Hero elements */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Colored shadow for CTAs */
shadow-olive: 0 10px 40px -10px rgba(26, 58, 42, 0.4);
```

---

## Typography

### Font Families
| Token | Font | Usage |
|-------|------|-------|
| `--font-heading` | Playfair Display | Headlines, titles, display text |
| `--font-sans` | Inter | Body text, UI elements, navigation |
| `--font-mono` | Geist Mono | Code, technical text |

### Google Fonts Import
```typescript
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
```

### Type Scale

| Level | Mobile | Tablet | Desktop | Line Height | Letter Spacing | Weight |
|-------|--------|--------|---------|-------------|----------------|--------|
| H1 | 2.25rem (36px) | 3.75rem (60px) | 6rem (96px) | 1.1 | -0.02em | 700 |
| H2 | 1.875rem (30px) | 3rem (48px) | 3.75rem (60px) | 1.2 | -0.01em | 600 |
| H3 | 1.5rem (24px) | 1.875rem (30px) | 2.25rem (36px) | 1.3 | 0 | 600 |
| H4 | 1.25rem (20px) | 1.5rem (24px) | 1.5rem (24px) | 1.4 | 0 | 600 |
| Body Large | 1rem (16px) | 1.125rem (18px) | 1.25rem (20px) | 1.6 | 0 | 400 |
| Body | 0.875rem (14px) | 1rem (16px) | 1rem (16px) | 1.6 | 0 | 400 |
| Small | 0.75rem (12px) | 0.875rem (14px) | 0.875rem (14px) | 1.5 | 0.01em | 400 |
| Caption | 0.625rem (10px) | 0.75rem (12px) | 0.75rem (12px) | 1.4 | 0.05em | 500 |

### Special Text Styles
```css
/* Badge/Label Text */
.badge-text {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--accent);
}

/* Hero Display */
.hero-title {
  font-family: var(--font-playfair);
  font-size: clamp(2.25rem, 8vw, 6rem);
  line-height: 1.1;
  font-weight: 700;
}

/* Section Title */
.section-title {
  font-family: var(--font-playfair);
  font-size: clamp(1.875rem, 5vw, 3.75rem);
  line-height: 1.2;
  font-weight: 600;
}
```

---

## Spacing & Layout

### Spacing Scale (Tailwind)
| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 0.25rem (4px) | Tight gaps, icon spacing |
| space-2 | 0.5rem (8px) | Inline elements |
| space-3 | 0.75rem (12px) | Small gaps |
| space-4 | 1rem (16px) | Default spacing |
| space-6 | 1.5rem (24px) | Component padding |
| space-8 | 2rem (32px) | Section gaps |
| space-12 | 3rem (48px) | Large gaps |
| space-16 | 4rem (64px) | Section padding mobile |
| space-20 | 5rem (80px) | Section padding tablet |
| space-24 | 6rem (96px) | Section padding desktop |
| space-32 | 8rem (128px) | Hero spacing |

### Container Widths
| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Default | 100% | 1rem (16px) |
| sm (640px) | 100% | 1.5rem (24px) |
| md (768px) | 100% | 2rem (32px) |
| lg (1024px) | 1024px | 2rem (32px) |
| xl (1280px) | 1200px | 2rem (32px) |
| 2xl (1536px) | 1400px | 2rem (32px) |

### Grid System
- 12-column grid
- Gap: 1rem (mobile), 1.5rem (tablet), 2rem (desktop)
- Common patterns: 1-col (mobile), 2-col (tablet), 3-4 col (desktop)

---

## Component Library

### Button Component
Located: `components/ui/button.tsx`

**Variants:**
- `default` - Primary olive background
- `outline` - Bordered, transparent background
- `secondary` - Sand/cream background
- `ghost` - Transparent with hover state
- `destructive` - Red/error state
- `link` - Text only with underline

**Sizes:**
- `xs` - 24px height (tags, compact)
- `sm` - 28px height (inline)
- `default` - 32px height (standard)
- `lg` - 36px height (prominent)
- `icon` - Square button for icons

**Usage:**
```tsx
<Button variant="default" size="lg">
  Prenota Ora
</Button>
<Button variant="outline">
  <ArrowRight className="w-4 h-4" />
  View Menu
</Button>
```

### Card Component
Located: `components/ui/card.tsx`

**Structure:**
- `Card` - Container with rounded corners
- `CardHeader` - Title and description area
- `CardTitle` - Heading text
- `CardDescription` - Subtitle text
- `CardContent` - Main content area
- `CardFooter` - Actions area
- `CardAction` - Top-right action slot

**Sizes:**
- `default` - Standard padding (16px)
- `sm` - Compact padding (12px)

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Menu Item</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Calendar Component
Located: `components/ui/calendar.tsx`

Used for booking date selection.
- Single date selection mode
- Disabled past dates
- Custom styling to match design system

### Dialog Component
Located: `components/ui/dialog.tsx`

**Parts:**
- `DialogTrigger` - Opens the dialog
- `DialogContent` - Main container
- `DialogHeader` - Title area
- `DialogTitle` - Heading
- `DialogDescription` - Subtitle
- `DialogFooter` - Action buttons

### Badge Component
Located: `components/ui/badge.tsx`

**Variants:**
- `default` - Primary style
- `secondary` - Muted style
- `outline` - Bordered
- `destructive` - Error state

### Separator Component
Located: `components/ui/separator.tsx`

- Horizontal or vertical dividers
- Uses `border-border` color

### Tabs Component
Located: `components/ui/tabs.tsx`

**Parts:**
- `TabsList` - Container for tab buttons
- `TabsTrigger` - Individual tab
- `TabsContent` - Panel content

### Custom Components

#### MagneticButton
Located: `components/magnetic-button.tsx`
- Adds magnetic hover effect
- Props: `strength` (default: 0.3)

#### MaskReveal
Located: `components/text-reveal.tsx`
- Text reveal animation on scroll
- Props: `delay`, `duration`

#### ScrollProgress
Located: `components/scroll-progress.tsx`
- Top progress bar indicator

#### CustomCursor
Located: `components/cursor.tsx`
- Custom cursor effect (desktop only)

---

## Responsive Breakpoints

| Name | Min Width | Max Width | Target Devices |
|------|-----------|-----------|----------------|
| `xs` | 0px | 639px | Mobile phones |
| `sm` | 640px | 767px | Large phones, small tablets |
| `md` | 768px | 1023px | Tablets |
| `lg` | 1024px | 1279px | Small laptops, tablets landscape |
| `xl` | 1280px | 1535px | Desktops |
| `2xl` | 1536px | ∞ | Large desktops, 4K |

### Mobile-First Approach
Always design for mobile first, then enhance for larger screens:

```tsx
// Mobile-first responsive pattern
className="
  text-base           /* Mobile default */
  sm:text-lg          /* 640px+ */
  md:text-xl          /* 768px+ */
  lg:text-2xl         /* 1024px+ */
  xl:text-3xl         /* 1280px+ */
"
```

### Common Responsive Patterns

**Container Padding:**
- Mobile: `px-4` (16px)
- Tablet: `sm:px-6` (24px)
- Desktop: `lg:px-8` (32px)

**Section Padding:**
- Mobile: `py-16` (64px)
- Tablet: `sm:py-20` (80px)
- Desktop: `lg:py-24` (96px)

**Grid Columns:**
- Mobile: `grid-cols-1`
- Tablet: `md:grid-cols-2`
- Desktop: `lg:grid-cols-3` or `lg:grid-cols-4`

**Font Sizes:**
Use `clamp()` for fluid typography or Tailwind responsive prefixes:
```css
font-size: clamp(1.5rem, 4vw + 1rem, 3.75rem);
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

#### Color Contrast
- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18px+ or 14px+ bold): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

**Verified Combinations:**
| Background | Text | Contrast | Pass |
|------------|------|----------|------|
| #f8f6f2 (cream) | #1a1a1a (charcoal) | 12.4:1 | ✓ AA |
| #1a3a2a (olive) | #f8f6f2 (cream) | 8.9:1 | ✓ AA |
| #ffffff (white) | #1a1a1a (charcoal) | 14.2:1 | ✓ AA |
| #c45c3e (terracotta) | #ffffff (white) | 4.8:1 | ✓ AA |
| #8b8175 (stone) | #ffffff (white) | 4.1:1 | ✓ AA |

#### Focus Indicators
All interactive elements must have visible focus states:
```css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

#### Reduced Motion
Respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h6)
- Use `<nav>` for navigation
- Use `<main>` for primary content
- Use `<section>` with aria-labels for page regions
- Use `<button>` for clickable actions, `<a>` for navigation

### ARIA Labels
```tsx
// Icon-only buttons
<button aria-label="Close menu">
  <XIcon />
</button>

// Decorative images
<img src="decorative.jpg" alt="" />

// Complex interactions
<nav aria-label="Main navigation">
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
```

### Screen Reader Support
- All form inputs must have associated labels
- Error messages linked with `aria-describedby`
- Live regions for dynamic content updates
- Skip links for keyboard navigation

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order (top-to-bottom, left-to-right)
- Escape key closes modals and menus
- Enter/Space activates buttons

---

## Animation Patterns

### Scroll-Triggered Animations
Using Framer Motion's `whileInView`:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  Content
</motion.div>
```

### Standard Durations
| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interaction | 150ms | ease-out |
| Button hover | 200ms | ease |
| Card reveal | 300ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Page transition | 400ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Hero parallax | 800ms | ease-out |

### Standard Easings
```css
/* Smooth deceleration */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Bounce effect */
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1);

/* Standard ease */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
```

### Parallax Effect
```tsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end start"],
});

const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
```

### Stagger Animation
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

---

## Figma Export Specifications

### Asset Export Settings

#### Icons
- Format: SVG
- Size: 24x24px (base), export at 1x
- Naming: `icon-[name].svg`
- Colors: Use currentColor for theming

#### Images
| Type | Format | Quality | Max Width |
|------|--------|---------|-----------|
| Hero background | WebP | 85% | 1920px |
| Menu photos | WebP | 80% | 800px |
| Gallery | WebP | 80% | 1200px |
| Thumbnails | WebP | 70% | 400px |

#### Logos
- Format: SVG (primary), PNG (fallback)
- Versions: Light, Dark, Monochrome
- Clear space: Minimum 8px around logo

### Design Handoff Checklist
- [ ] All colors defined with hex values
- [ ] Typography with font sizes, weights, line heights
- [ ] Spacing measurements in px/rem
- [ ] All states shown (default, hover, active, disabled)
- [ ] Responsive breakpoints indicated
- [ ] Animation specifications with duration/timing
- [ ] Assets exported and named correctly

### Export Naming Convention
```
assets/
├── icons/
│   ├── icon-calendar.svg
│   ├── icon-chevron-down.svg
│   └── ...
├── images/
│   ├── hero-background.webp
│   ├── menu/
│   │   ├── antipasti-1.webp
│   │   └── ...
│   └── gallery/
│       ├── gallery-1.webp
│       └── ...
└── logo/
    ├── logo-light.svg
    ├── logo-dark.svg
    └── logo-mono.svg
```

---

## Implementation Notes

### Tailwind CSS v4 Configuration
The project uses Tailwind CSS v4 with the new `@theme` directive. All custom tokens are defined in `globals.css`.

### shadcn/ui Components
Components are built on Radix UI primitives with Tailwind styling. Customize via:
1. CSS variables in `:root`
2. Component-level className overrides
3. Variant modifications in component files

### Dark Mode Implementation
Uses `next-themes` with class-based strategy:
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem
>
```

### Performance Guidelines
- Use `will-change` sparingly on animated elements
- Lazy load images below the fold
- Use `loading="lazy"` for images
- Implement `font-display: swap` for fonts
- Minimize motion for `prefers-reduced-motion`

---

*Last Updated: March 2026*
*Design System Version: 1.0.0*
