# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs-First Rule

**Before generating any code, always check the `/docs` directory for a relevant standards file and follow it.**

- UI work → read `docs/ui.md` first
- Any other domain with a doc → read it before writing code
- The docs take precedence over general conventions or defaults

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js App Router** project using TypeScript, React 19, and Tailwind CSS v4.

- `app/` — App Router directory. Each folder becomes a route segment. `layout.tsx` wraps all pages; `page.tsx` files define route UI.
- `app/layout.tsx` — Root layout: sets global fonts (Geist Sans/Mono via `next/font/google`), metadata, and wraps all pages.
- `app/globals.css` — Global styles using Tailwind CSS v4 (`@import "tailwindcss"`). Theme variables defined here with `@theme inline`.
- `public/` — Static assets served at `/`.
- Path alias `@/*` maps to the project root.

## Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS v4** (configured via PostCSS in `postcss.config.mjs`)
- **TypeScript 5** with strict mode
- **ESLint 9** flat config (`eslint.config.mjs`)
