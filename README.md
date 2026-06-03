# 🚀 PromptPilot (PromptForge AI)

**Live Deployment:** [https://prompt-pilot-bjpjemx5e-code-hunter-s-projects.vercel.app/](https://prompt-pilot-bjpjemx5e-code-hunter-s-projects.vercel.app/)

---

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.1-2d3748?logo=prisma&style=flat-square)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/PostgreSQL-Neon.tech-4169e1?logo=postgresql&style=flat-square)](https://neon.tech/)
[![Authentication](https://img.shields.io/badge/Auth-Better--Auth-orange?style=flat-square)](https://www.better-auth.com/)

PromptPilot is a production-grade, type-safe prompt engineering platform, AI prompt manager, and technical project blueprinting system. Built using a modern Next.js 15 App Router stack, it enables developers, system architects, and prompt builders to write, improve, organize, version, and monitor AI prompts, as well as generate end-to-end technical project plans.

---

## 🌟 Core Functional Modules

### 1. 💡 AI Prompt Architect & Generator
Allows users to craft, polish, and structure raw ideas into production-ready prompts using an advanced layout configuration.
- **Tailored Templates:** Select prompt frameworks like *System Prompt*, *Few-Shot Instruction*, or *Text Classifier*.
- **Editor Profiles:** Optimize output format specifically for development environments like **Cursor Rules (`.cursorrules`)**, **VS Code Snips**, or generic markdown.
- **Variables & Constraints:** Inject custom parameters, system variables, negative constraints, and output schema boundaries directly into the generator prompt.

### 2. ⚡ Intelligent Dual-Provider Failover Engine
Designed to keep the generation tools highly available without hitting service bottlenecks or free-tier rate limits.
- **Gemini 2.0 Flash (Primary):** Utilizes Google's fast, long-context Gemini API models for high-quality, structured output.
- **Groq Cloud Failover (Secondary):** Instantly shifts queries to Groq's high-speed **Llama 3.3 70B** or **Llama 3.1 8B** model if the Gemini API key runs out of quota (`limit: 0` errors) or throws server errors.
- **Smart Tokens & Limits:** Automatically monitors token counts and downscales maximum token requests to protect API boundaries.

### 3. 🗺️ Interactive Technical Project Planner
A powerful blueprint generator that converts project descriptions into organized technical specifications.
- **High-Level Design:** Outputs a full system architecture layout and design decision log.
- **Schema & Database:** Generates SQL structures and Prisma models.
- **Folder Trees:** Outlines the proposed file and directory tree.
- **Roadmap & Checklist:** Builds step-by-step phases, UAT criteria, and verification commands.
- **Interactive Markdown:** Renders the generated blueprint with copyable code blocks, tabs, and exportable layouts.

### 4. 📚 Dynamic Prompt Library & Collections
Organize and retrieve prompt assets through a collaborative and clean repository interface.
- **Folders & Tags:** Group prompts into custom collections (e.g., "SQL Utilities", "Coding Assistants") and search by tags.
- **History & Version Control:** Tracks every edit made to a prompt, allowing you to restore previous versions or review old outputs.
- **Favorites & Metadata:** Quick-filter by favorite status, target AI model, and generation date.

### 5. 📊 Real-Time Usage Analytics Dashboard
Tracks system statistics and displays analytics for individual users or global administrators.
- **Time Ranges:** View usage metrics over 7 days, 30 days, or a custom duration.
- **KPI Summary Cards:** Track total prompt generations, total token consumption, estimated API cost savings, and average latency.
- **Interactive Charts:** Beautifully displays generation counts, active providers, and model distribution.

### 6. 🛡️ Authentication & Administration
Secures database states and isolates prompt assets to their rightful owners.
- **Better Auth Integration:** Provides a modular authentication system supporting standard credentials (Email/Password) with server-side middleware access guards.
- **Admin Console:** Users with the `ADMIN` role can access system-wide analytics, monitor health checks, manage user accounts, and update system prompt templates.

---

## 🛠️ Architecture & Folder Structure

The project strictly follows a **Feature-Based Architecture** to keep frontend interactions, Zod schemas, server actions, queries, and type safety rules co-located inside dedicated feature modules:

```txt
src/
  app/                    # App Router routes, page layouts, route groups, and API endpoints
    (auth)/               # Auth pages (login, register)
    (dashboard)/          # Dashboard pages (library, generator, planner, analytics)
    admin/                # Administrator system consoles
    api/                  # Backend endpoints (Auth handlers, Analytics routers)
  components/
    ui/                   # Shadcn UI low-level components (dialog, badge, select, etc.)
    layout/               # Sidebars, headers, theme switches, and layout wrappers
    feedback/             # Skeletons, loading states, empty panels, and toast alerts
  features/
    prompts/              # Local actions, generators, history controls, and schemas
    planner/              # Project planner components, hooks, and plan actions
    auth/                 # Session contexts, forms, and authorization checks
    analytics/            # Analytics overview, charts, and endpoint hooks
    admin/                # User management and prompt template actions
  lib/
    db/                   # Prisma client configurations
    env/                  # Strict environment schema parsing (Zod)
    utils/                # Formatting utilities, HSL tailwind colors, rate limiters
```

---

## 🚀 Getting Started

Follow these steps to set up a local development copy of the project.

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/Shantanu112-bd/PromptPilot.git
cd PromptPilot
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to create your local environment file:
```bash
cp .env.example .env
```
Fill in the values in your new `.env` file:
```env
# Database connection (Neon Postgres pooler link recommended)
DATABASE_URL="postgresql://neondb_owner:password@host/neondb?sslmode=require"

# Better Auth secret and URLs
BETTER_AUTH_SECRET="your-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# AI Provider Credentials
GEMINI_API_KEY="your-google-ai-studio-key"
GROQ_API_KEY="your-groq-api-key"
```

### 3. Generate Database Client & Seed Initial Data
Before starting the application, generate the Prisma models and seed the database with initial tools, default templates, and standard AI models:
```bash
# Generate Prisma Client types
npm run db:generate

# Push schema definitions to database
npx prisma db push

# Seed database categories, default models, and system prompts
npm run db:seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser to view the application.

---

## 🔧 Script Commands Reference

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on port 3001 |
| `npm run build` | Compiles the production build (ignores TS/ESlint warnings to ensure clean deployment) |
| `npm run db:generate` | Refreshes local Prisma client types |
| `npm run db:seed` | Seeds database with initial system templates, categories, and AI models |
| `npm run test` | Runs unit tests using Vitest |
| `npm run typecheck` | Validates TypeScript files for syntax correctness |
| `npm run lint` | Runs ESLint syntax and code styling checks |

---

## 🧪 Testing & Verification
You can run automated checks locally to verify that all modules compile and operate correctly:
```bash
# Verify unit tests
npm run test

# Check TypeScript type consistency
npm run typecheck
```

---

## ☁️ Deploy to Vercel

This application is fully optimized for Vercel:
1. **Compilation Setup:** The build command is configured as `prisma generate && next build` to safely compile on Vercel without triggering migration locks.
2. **Environment Setup:** Ensure you add all the `.env` variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, etc.) to your Vercel project environment settings.
3. **Database Client:** Prisma Client will automatically update types inside the Vercel build container before Next.js builds the bundle.
