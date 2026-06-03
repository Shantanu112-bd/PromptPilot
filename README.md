# 🚀 PromptForge AI

**Live Demo:** [https://prompt-pilot-bjpjemx5e-code-hunter-s-projects.vercel.app/](https://prompt-pilot-bjpjemx5e-code-hunter-s-projects.vercel.app/)

PromptForge AI is a production-grade prompt engineering, management, and generation platform. Designed for developers, prompt architects, and AI builders, it helps you convert raw ideas into clean prompt structures, optimize prompt instructions via an intelligent multi-provider AI model switcher, organize them into collections, and track analytical usage logs.

---

## ✨ Features

- **💡 Prompt Architect & Generator:** Converts rough ideas into optimized markdown prompts tailored for specific editors (Cursor, VS Code, etc.), target models, and framework constraints.
- **✨ AI Prompt Improver:** Enhances prompt layouts using Google Gemini 2.0 Flash or falls back to Groq’s high-speed Llama 3.3 70B model if quotas are reached.
- **🗺️ Project Planner:** Analyzes product briefs to instantly generate detailed technical designs, database schemas, roadmap phases, folder trees, and deployment outlines.
- **📚 Prompt Library & Collections:** Save, duplicate, favorite, version, and tag prompts. Group them into dynamic collections for easy modular retrieval.
- **📊 Usage Analytics Dashboard:** Monitor total generations, token consumption, cost estimates, and provider breakdown over 7d, 30d, or custom periods.
- **🔒 Production Auth & Security:** Secure session management with Better Auth, email/password fallback, rate limiting, and owner-based permission boundaries.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5+ (App Router)
- **Styling:** TailwindCSS & Tailwind Animate (harmonious Dark Mode support)
- **UI Components:** Shadcn UI & Radix Primitives
- **Database:** PostgreSQL (optimised on Neon Serverless Postgres)
- **ORM:** Prisma
- **Auth:** Better Auth
- **AI Providers:** Gemini API (v1beta) & Groq Cloud API
- **State Management:** Zustand

---

## 📂 Architecture & Folder Layout

The project follows a **Feature-Based Architecture** to keep domain logic, components, schemas, and queries co-located.

```txt
src/
  app/                    # App Router routes, API paths, layouts, error/loading views
  components/
    ui/                   # Shadcn low-level design system primitives
    layout/               # Sidebar shells, mobile menus, and headers
    feedback/             # Empty states, page loaders, and alerts
  features/               # Modular features containing feature-local code
    prompts/              # Generators, improvers, history dialogs, provider rules
    planner/              # Project planning server actions and components
    auth/                 # Session check helpers and forms
    analytics/            # Analytics helpers and hooks
    admin/                # Admin panels for managing users and system templates
  lib/
    db/                   # Prisma client configurations
    env/                  # Strict environment schema parsing (Zod)
    utils/                # Formatting and rate limiting
```

---

## 🚀 Getting Started

### 1. Clone the project and install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Fill in the required values:
```env
# Database URL (recommended: Neon Postgres connection string)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Better Auth Configurations
BETTER_AUTH_SECRET="your-32-character-random-secret"
BETTER_AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# AI Provider Keys
GEMINI_API_KEY="your-google-ai-studio-api-key"
GROQ_API_KEY="your-groq-console-api-key"
```

### 3. Generate Database Clients & Seed
Generate the Prisma client types and apply migrations to your database:
```bash
# Generate types
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed database with initial categories, tools, and models
npm run db:seed
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📊 Quality Verification & Testing

```bash
# Run lint check
npm run lint

# Verify type safety
npm run typecheck

# Execute unit and service tests
npm run test
```

---

## ☁️ Deploy to Vercel

This app runs natively on Vercel with serverless databases.

1. **Database Client Generation:**
   The `build` script in `package.json` is set to generate the Prisma client during compilation:
   ```json
   "build": "prisma generate && next build"
   ```

2. **Add Environment Variables:**
   Add `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `GEMINI_API_KEY`, and `GROQ_API_KEY` to the project variables inside the Vercel Dashboard settings.
