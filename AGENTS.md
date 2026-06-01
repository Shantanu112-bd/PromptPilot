# AGENTS.md

## Project Overview

**Project Name:** PromptForge AI

PromptForge AI is a production-grade AI prompt management and generation platform built with a modern, type-safe web stack. The codebase should prioritize maintainability, accessibility, scalability, and a polished mobile-first user experience.

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI System:** Shadcn UI
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth
- **State Management:** Zustand

## Core Engineering Principles

- Build production-ready features, not prototypes.
- Prefer simple, explicit, maintainable code over clever abstractions.
- Keep type safety strict across the full stack.
- Use feature-based architecture for product functionality.
- Keep shared primitives reusable, accessible, and design-system aligned.
- Design mobile-first, then enhance for tablet and desktop.
- Support dark mode for every user-facing screen.
- Treat loading, error, and empty states as required UI states.
- Validate data at system boundaries.
- Avoid duplicating business logic across client and server.
- Prefer server components by default; use client components only when interactivity requires them.

## Recommended Folder Structure

Use this structure unless the repository already has a clear established convention.

```txt
src/
  app/
    (auth)/
    (dashboard)/
    api/
    layout.tsx
    page.tsx
  components/
    ui/
    common/
    layout/
    feedback/
    forms/
  features/
    prompts/
      components/
      hooks/
      lib/
      schemas/
      server/
      stores/
      types/
    auth/
      components/
      lib/
      server/
      types/
    users/
      components/
      lib/
      server/
      types/
  lib/
    auth/
    db/
    env/
    errors/
    utils/
    validations/
  prisma/
    schema.prisma
    migrations/
  stores/
  styles/
  types/
```

### Folder Responsibilities

- `src/app`: Next.js routes, layouts, route groups, metadata, and API route handlers.
- `src/components/ui`: Shadcn UI components and low-level UI primitives.
- `src/components/common`: Reusable app-level components that are not feature-specific.
- `src/components/layout`: Shells, nav, sidebars, headers, and page layout components.
- `src/components/feedback`: Loading indicators, skeletons, empty states, error states, toasts, and alerts.
- `src/features`: Feature-based modules. Product logic should live here when it belongs to a domain area.
- `src/lib`: Cross-cutting infrastructure such as auth, database, environment validation, errors, and utilities.
- `src/stores`: Global Zustand stores only. Prefer feature-local stores when state is feature-specific.
- `src/types`: Shared global TypeScript types. Prefer colocated feature types when possible.

## Architecture Guidelines

### Feature-Based Architecture

Each feature should own its components, schemas, server actions, queries, mutations, hooks, stores, and types when they are specific to that feature.

Prefer:

```txt
src/features/prompts/components/prompt-card.tsx
src/features/prompts/server/create-prompt.ts
src/features/prompts/schemas/prompt-schema.ts
```

Avoid scattering feature logic across unrelated global folders.

### Server and Client Boundaries

- Use React Server Components by default.
- Add `"use client"` only when a component needs browser-only APIs, local state, effects, event handlers, or client-side stores.
- Keep database access, Better Auth server logic, secrets, and privileged operations on the server.
- Do not import Prisma clients, server-only auth helpers, or secret-bearing modules into client components.
- Keep server actions focused, validated, and easy to test.

### Reusable Components

- Build reusable components when a pattern appears more than once or is clearly part of the design system.
- Keep Shadcn UI primitives in `components/ui`.
- Compose primitives into app-specific components in `components/common`, `components/layout`, or feature folders.
- Avoid over-generalizing components before real usage exists.
- Components should expose typed props and avoid accepting broad `any` objects.

## TypeScript Standards

- Use strict TypeScript.
- Avoid `any`. If a type is unknown, use `unknown` and narrow it.
- Prefer explicit domain types for important business entities.
- Infer types from Prisma, Zod schemas, or typed APIs when appropriate.
- Keep API responses typed.
- Keep form values typed from validation schemas.
- Use discriminated unions for state that can be loading, success, empty, or error.

Example:

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error"; error: string };
```

## Styling and UI Guidelines

### TailwindCSS

- Use Tailwind utility classes consistently.
- Prefer existing design tokens and CSS variables.
- Avoid hard-coded colors when a theme token exists.
- Keep class lists readable.
- Extract repeated style patterns into components rather than global CSS.

### Shadcn UI

- Use Shadcn UI components as the baseline for forms, dialogs, dropdowns, tabs, tables, menus, popovers, command menus, toasts, and similar primitives.
- Keep generated Shadcn components clean and close to their expected API.
- Extend components through composition instead of modifying primitives heavily.

### Mobile-First Responsive Design

- Start layouts from the smallest viewport.
- Use responsive Tailwind prefixes such as `sm:`, `md:`, `lg:`, and `xl:` to enhance layout progressively.
- Ensure touch targets are large enough on mobile.
- Avoid horizontal overflow.
- Test dense dashboards, tables, and forms on narrow screens.

### Dark Mode

- Every user-facing component must work in light and dark themes.
- Use theme-aware tokens such as `background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, and `destructive`.
- Avoid one-off color values that fail contrast in dark mode.
- Verify hover, focus, disabled, selected, and error states in both themes.

## Accessibility Requirements

- Use semantic HTML first.
- Ensure interactive controls are keyboard accessible.
- Provide visible focus states.
- Use accessible labels for icon buttons, form fields, and navigation controls.
- Use `aria-*` attributes only when semantic HTML is insufficient.
- Maintain sufficient color contrast in light and dark mode.
- Use proper heading order.
- Do not rely on color alone to communicate state.
- Dialogs, menus, popovers, and sheets should follow Shadcn/Radix accessibility patterns.

## Data and Database Guidelines

### Prisma

- Keep Prisma schema changes intentional and migration-backed.
- Prefer clear model names and explicit relations.
- Add indexes for common lookup paths.
- Avoid querying unnecessary fields.
- Keep database access in server-only modules.
- Use transactions for multi-step writes that must succeed or fail together.

### PostgreSQL

- Design schema changes with production data in mind.
- Avoid destructive migrations unless explicitly required.
- Prefer safe migration patterns for non-null fields and large tables.
- Use database constraints to protect important invariants.

## Authentication Guidelines

### Better Auth

- Keep Better Auth configuration centralized under `src/lib/auth`.
- Keep session and user access helpers server-side unless a client-safe API is explicitly needed.
- Protect authenticated routes at the layout, middleware, or server boundary as appropriate.
- Never trust client-provided user IDs for authorization.
- Always check ownership or permissions before reading or mutating user-owned data.

## State Management Guidelines

### Zustand

- Use Zustand for client state that must be shared across multiple components.
- Keep server state out of Zustand when it belongs in server components, route loaders, or query/mutation flows.
- Prefer feature-local stores under `src/features/<feature>/stores`.
- Keep global stores small and focused.
- Define store state and actions with explicit TypeScript types.
- Avoid storing sensitive session data in client stores.

## Error Handling

- Handle expected errors explicitly.
- Use typed result objects or known error classes for business logic.
- Do not expose internal error details to users.
- Log enough context for debugging server-side failures.
- Show friendly, actionable messages in the UI.
- Add error boundaries for route segments with meaningful recovery options.
- Use `not-found.tsx`, `error.tsx`, and `loading.tsx` where appropriate in the Next.js app router.

Recommended result shape:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

## Loading, Empty, and Error States

Every user-facing data view should include:

- A loading state, often using skeleton UI.
- An empty state that explains what is missing and offers a next action when possible.
- An error state with a recovery path.
- Disabled or pending states for submitting forms and triggering mutations.

Do not leave blank panels, frozen buttons, or silent failures.

## Forms and Validation

- Validate all form input before mutation.
- Prefer schema-based validation.
- Keep validation schemas close to the feature that owns them.
- Show field-level errors where possible.
- Disable submit actions while pending.
- Preserve user input after recoverable validation failures.
- Sanitize and normalize values before persistence.

## API and Server Actions

- Validate all inputs.
- Authenticate and authorize before accessing protected data.
- Return typed responses.
- Use consistent error shapes.
- Avoid leaking stack traces or internal implementation details.
- Keep handlers small and delegate business logic to feature server modules.
- Prefer server actions for app-router-native mutations when appropriate.
- Use API routes for external integrations, webhooks, or endpoints consumed outside React.

## Performance Guidelines

- Prefer server-rendered data where practical.
- Avoid unnecessary client components.
- Split large interactive components.
- Use dynamic imports for heavy client-only features.
- Avoid fetching the same data repeatedly across nested components.
- Use selective Prisma queries.
- Optimize images with Next.js image handling.
- Keep bundle size in mind when adding dependencies.

## Testing and Verification

When adding or changing behavior, use the repository's established test setup. If no test setup exists yet, structure code so it can be tested later and manually verify critical paths.

Recommended coverage areas:

- Validation schemas.
- Server actions and API route logic.
- Authorization-sensitive data access.
- Zustand stores.
- Reusable UI components with important states.
- Critical user flows such as sign in, create prompt, edit prompt, delete prompt, and dashboard rendering.

Before finishing a task, run the relevant checks when available:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

Use the package manager already established by the repository.

## Naming Conventions

- Use kebab-case for file names: `prompt-card.tsx`.
- Use PascalCase for React components: `PromptCard`.
- Use camelCase for functions and variables.
- Use PascalCase for TypeScript types and interfaces.
- Use clear server action names: `createPrompt`, `updatePrompt`, `deletePrompt`.
- Prefer domain-specific names over generic names.

## Environment Variables

- Keep environment parsing centralized.
- Validate required environment variables at startup.
- Never expose secrets through client-side `NEXT_PUBLIC_` variables.
- Use `NEXT_PUBLIC_` only for values that are safe to ship to the browser.
- Document required variables in `.env.example`.

Common variables may include:

```txt
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

## Security Requirements

- Authenticate protected actions.
- Authorize access to user-owned resources.
- Validate and sanitize all user input.
- Protect against IDOR by checking resource ownership.
- Avoid exposing secrets or internal errors to the client.
- Use secure cookies and recommended Better Auth defaults.
- Treat AI-generated content as untrusted user content.
- Escape or sanitize rendered user content when needed.

## AI Feature Guidelines

PromptForge AI likely handles user-created prompts, generated content, and AI workflow metadata. Treat all user and model-generated content carefully.

- Store prompts and generated content with clear ownership.
- Do not execute user-provided prompt content as code.
- Sanitize content before rendering as HTML.
- Track prompt versions when editing history matters.
- Provide clear empty states for users who have not created prompts yet.
- Make destructive actions, such as deleting prompts, confirmable.
- Keep AI request errors understandable and recoverable.

## Pull Request and Change Guidelines

Every meaningful change should aim to include:

- Focused implementation.
- Type-safe data flow.
- Reusable components where appropriate.
- Mobile and dark-mode support.
- Loading, empty, and error states.
- Accessible interactions.
- Relevant tests or a clear verification note.

Avoid:

- Unrelated refactors.
- Broad rewrites without need.
- Introducing new dependencies without justification.
- Client-side access to server-only modules.
- Silent error handling.
- UI that only works in light mode or desktop layouts.

## Agent Workflow

When working in this repository:

1. Inspect the existing structure before adding files or patterns.
2. Follow established conventions when they exist.
3. Keep changes scoped to the requested feature or fix.
4. Prefer feature-local code for domain behavior.
5. Reuse Shadcn UI and existing components before creating new primitives.
6. Preserve type safety and avoid `any`.
7. Add loading, empty, error, disabled, and success states where relevant.
8. Verify mobile responsiveness and dark mode for UI changes.
9. Run relevant lint, typecheck, test, or build commands when available.
10. Summarize what changed and mention any checks that could not be run.

## Definition of Done

A task is complete when:

- The implementation satisfies the requested behavior.
- Code follows the repository architecture and naming conventions.
- TypeScript types are accurate and strict.
- UI works on mobile and desktop.
- Light and dark themes are supported.
- Loading, empty, and error states are handled.
- Accessibility basics are covered.
- Auth, authorization, and validation are handled for protected data.
- Relevant checks have been run or the reason they were skipped is stated.

