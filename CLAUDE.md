# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo containing:

- `hookhub/` - Next.js 15 application with React 19, TypeScript, and Tailwind CSS v4

## Development Commands

### HookHub (Next.js App)

All commands should be run from the `hookhub/` directory:

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

The dev server runs on `http://localhost:3000` by default.

## Tech Stack

### HookHub
- **Framework**: Next.js 15.5.4 with App Router
- **React**: 19.1.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Build Tool**: Turbopack (Next.js's faster bundler)
- **Linting**: ESLint 9 with Next.js config

## Code Architecture

### Next.js App Router Structure
- Uses the App Router pattern (not Pages Router)
- Entry points:
  - `hookhub/src/app/layout.tsx` - Root layout with Geist fonts
  - `hookhub/src/app/page.tsx` - Home page component
- TypeScript path alias: `@/*` maps to `src/*`

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- JSX: preserve (handled by Next.js)

### Styling Approach
- Tailwind CSS v4 via PostCSS
- Uses Geist and Geist Mono fonts from next/font/google
- Global styles in `hookhub/src/app/globals.css`

## Key Configuration Files

- `hookhub/package.json` - Dependencies and scripts
- `hookhub/tsconfig.json` - TypeScript configuration with path aliases
- `hookhub/next.config.ts` - Next.js configuration
- `hookhub/eslint.config.mjs` - ESLint flat config with Next.js rules
- `hookhub/postcss.config.mjs` - PostCSS configuration for Tailwind
