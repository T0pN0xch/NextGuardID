# Typography Standards - NextGuard ID

## Standardized Font Sizes & Weights

### Page Headers (Main Title)
- **Size:** `text-3xl`
- **Weight:** `font-bold`
- **Example:** Page titles like "Dashboard", "Settings", "Audit Log"
- **Class:** `className="text-3xl font-bold"`

### Page Subtitle
- **Size:** `text-sm`
- **Color:** `text-muted-foreground` (or `text-gray-600`)
- **Example:** Descriptive text below page title
- **Class:** `className="text-sm text-muted-foreground mt-1"`

### Section Headers (h2)
- **Size:** `text-lg`
- **Weight:** `font-bold`
- **Example:** "Recent MyKad Usage", "Recent Identity Usage", etc.
- **Class:** `className="text-lg font-bold"`

### Subsection Headers (h3)
- **Size:** `text-base`
- **Weight:** `font-semibold`
- **Example:** Card titles, setting group titles
- **Class:** `className="text-base font-semibold"`

### Body Text
- **Size:** `text-sm`
- **Weight:** `font-normal`
- **Example:** Descriptions, explanations
- **Class:** `className="text-sm"`

### Small Text / Secondary
- **Size:** `text-xs`
- **Color:** `text-muted-foreground`
- **Weight:** `font-normal`
- **Example:** Timestamps, helper text
- **Class:** `className="text-xs text-muted-foreground"`

### Labels (Form Labels, Badges)
- **Size:** `text-xs`
- **Weight:** `font-semibold`
- **Style:** `uppercase` (optional)
- **Class:** `className="text-xs font-semibold uppercase"`

### Card Statistics (Large Numbers)
- **Size:** `text-2xl`
- **Weight:** `font-bold`
- **Example:** "42 Events", "5 Records"
- **Class:** `className="text-2xl font-bold"`

## Quick Reference Chart

| Element | Size | Weight | Color | Example |
|---------|------|--------|-------|---------|
| Page Title | text-3xl | bold | gray-900 | "Settings" |
| Page Subtitle | text-sm | normal | muted-foreground | "Manage your preferences" |
| Section Title | text-lg | bold | gray-900 | "Recent Activity" |
| Subsection | text-base | semibold | gray-900 | Card title |
| Body Text | text-sm | normal | gray-900 | Description |
| Small Text | text-xs | normal | muted-foreground | Timestamp |
| Label | text-xs | semibold | muted-foreground | "INSTITUTION" |
| Stat Number | text-2xl | bold | color-variant | "42" |

## Color Conventions

- **Primary Text:** `text-gray-900`
- **Secondary Text:** `text-gray-600` or `text-muted-foreground`
- **Muted Text:** `text-xs text-muted-foreground`
- **Emphasis:** Use theme colors (blue, emerald, red) for important data

## Spacing with Typography

- **After Page Title:** `mt-1` for subtitle
- **Section Title to Content:** `mb-3` to `mb-4`
- **Between Elements:** `gap-2` for icons + text, `gap-3` for larger spacing
