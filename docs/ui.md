# UI Coding Standards

## Component Library

**Only shadcn/ui components must be used for all UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, dialogs, etc.)
- Do NOT use raw HTML elements styled with Tailwind where a shadcn/ui component exists
- Install shadcn/ui components as needed via `npx shadcn@latest add <component>`
- All available components: https://ui.shadcn.com/docs/components

### Examples

```tsx
// CORRECT — use shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// INCORRECT — do not create custom components
const MyButton = ({ children }) => (
  <button className="bg-blue-500 px-4 py-2 rounded">{children}</button>
)
```

## Date Formatting

All dates must be formatted using **date-fns**. Do not use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting method.

### Required Format

Dates are displayed as: `1st Sep 2025`, `2nd Aug 2025`, `3rd Jan 2026`, `4th Jun 2024`

This is: ordinal day + abbreviated month + full year.

### Implementation

```tsx
import { format } from "date-fns"

function formatDate(date: Date): string {
  const day = date.getDate()
  const suffix =
    day % 10 === 1 && day !== 11 ? "st"
    : day % 10 === 2 && day !== 12 ? "nd"
    : day % 10 === 3 && day !== 13 ? "rd"
    : "th"

  return format(date, `d'${suffix}' MMM yyyy`)
}

// Usage
formatDate(new Date("2025-09-01")) // "1st Sep 2025"
formatDate(new Date("2025-08-02")) // "2nd Aug 2025"
formatDate(new Date("2026-01-03")) // "3rd Jan 2026"
formatDate(new Date("2024-06-04")) // "4th Jun 2024"
```

Place this utility in `lib/format-date.ts` and import it wherever dates are displayed.
