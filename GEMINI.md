# Devhubb

## Architecture
- **Framework:** Next.js (App Router)
- **Database/Auth:** Supabase
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **State Management:** React Hooks / Server Actions

## Conventions
- **File Structure:** 
  - `app/`: Next.js routes and server components.
  - `components/`: Reusable UI and layout components.
  - `lib/`: Shared utilities and database clients.
  - `hooks/`: Custom React hooks.
  - `scripts/`: SQL migration/setup scripts.
- **Naming:** Use kebab-case for file names and PascalCase for React components.
- **Styling:** Use Tailwind CSS utility classes and CSS variables defined in `app/globals.css`.

## Workflows
- **Database:** Supabase migrations are located in `scripts/`.
- **Authentication:** Handled via Supabase Auth with callbacks in `app/auth/callback/route.ts`.
