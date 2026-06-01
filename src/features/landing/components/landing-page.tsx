"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const tools = [
  "Cursor",
  "Claude Code",
  "GitHub Copilot",
  "Windsurf",
  "Warp",
  "Bolt",
  "Lovable",
  "ChatGPT",
  "Gemini",
  "DeepSeek"
];

const features = [
  "Prompt Generator",
  "Prompt Improver",
  "Project Planner",
  "Prompt Library",
  "Tool Intelligence Engine",
  "AI Tool Recommendations"
];

const faqs = [
  {
    question: "What does PromptForge AI generate?",
    answer:
      "It turns raw ideas into optimized prompts, PRDs, architecture plans, API specs, database schemas, roadmaps, and tool-specific instructions."
  },
  {
    question: "Which AI tools does it support?",
    answer:
      "PromptForge AI is designed for Cursor, Claude Code, Copilot, Windsurf, Warp, Bolt, Lovable, ChatGPT, Gemini, DeepSeek, and other AI development tools."
  },
  {
    question: "Is it only for developers?",
    answer:
      "Developers get the deepest workflow support, but founders, product teams, designers, and technical operators can use it to shape ideas into execution-ready plans."
  },
  {
    question: "Can teams share prompt libraries?",
    answer:
      "Yes. The product architecture includes prompt libraries, templates, saved prompts, collections, and team-ready usage analytics."
  }
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#171e19] text-white">
      <LandingNav />
      <HeroSection />
      <SupportedToolsSection />
      <HowItWorksSection />
      <ShowcaseSection />
      <FeaturesSection />
      <ProjectPlannerSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}

function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-4 text-white sm:px-8 lg:px-12">
        <Link href="/" className="font-display text-2xl uppercase tracking-tight transition-opacity duration-500 hover:opacity-70">
          PROMPTFORGE AI
        </Link>
        <div className="hidden items-center gap-8 text-sm font-light md:flex">
          {["Features", "Tools", "Templates", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="transition-all duration-500 hover:tracking-wide hover:text-[#d5f4f9]"
            >
              {item}
            </a>
          ))}
        </div>
        <Link
          href="/sign-up"
          className="rounded-full border border-white px-5 py-2 text-sm font-semibold transition-all duration-500 hover:bg-white hover:text-[#171e19]"
        >
          Start Building
        </Link>
      </nav>
    </header>
  );
}

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], [0, 120]);

  return (
    <section className="relative flex min-h-screen overflow-hidden bg-[#171e19] px-4 pb-10 pt-28 sm:px-8 lg:px-12">
      <motion.div
        aria-hidden="true"
        className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[#b7c6c2]/20 blur-[120px]"
        animate={{ x: [0, 28, -18, 0], y: [0, -24, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[12%] top-[38%] h-80 w-80 rounded-full bg-[#bbe2f5]/20 blur-[120px]"
        animate={{ x: [0, -32, 18, 0], y: [0, 28, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1800px] flex-col justify-between">
        <motion.div style={{ y }} className="pt-8">
          <Reveal>
            <p className="mb-6 max-w-xl text-sm font-light uppercase tracking-[0.35em] text-[#b7c6c2]">
              AI prompt infrastructure for modern builders
            </p>
          </Reveal>
          <h1 className="font-display text-[21vw] uppercase leading-[0.78] tracking-tighter text-white sm:text-[18vw]">
            <Reveal as="span" className="block">
              BUILD
            </Reveal>
            <Reveal as="span" className="block text-stroke-white">
              BETTER
            </Reveal>
            <Reveal as="span" className="block">
              PROMPTS
            </Reveal>
          </h1>
        </motion.div>

        <div className="grid gap-10 pb-4 pt-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <Reveal>
            <div>
              <p className="max-w-3xl text-lg font-light leading-8 text-[#d7c5b2] sm:text-2xl">
                Generate optimized prompts for Cursor, Claude Code, Copilot, Windsurf, Warp, Bolt, Lovable, ChatGPT,
                Gemini, DeepSeek and other AI tools.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LandingButton href="/sign-up">Start Generating</LandingButton>
                <LandingButton href="#features" variant="outline">
                  Explore Features
                </LandingButton>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="flex items-end justify-between gap-8">
              <p className="font-display text-3xl uppercase leading-none text-[#b7c6c2] sm:text-5xl">
                One idea.
                <br />
                Every AI tool.
              </p>
              <motion.a
                href="#tools"
                aria-label="Scroll to supported tools"
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <ArrowDown className="h-8 w-8" aria-hidden="true" />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SupportedToolsSection() {
  return (
    <section id="tools" className="bg-white px-4 py-24 text-[#171e19] sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1800px]">
        <Reveal>
          <h2 className="font-display text-7xl uppercase leading-none tracking-tighter sm:text-8xl lg:text-9xl">
            Supported Tools
          </h2>
        </Reveal>
        <div className="mt-16 grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => (
            <Reveal key={tool} delay={index * 0.04}>
              <motion.article
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7, ease }}
                className={cn(
                  "group relative flex h-full overflow-hidden rounded-lg border border-[#171e19]/10 bg-[#f4f1ed] p-6",
                  index === 0 || index === 5 ? "lg:row-span-2" : "",
                  index === 2 || index === 7 ? "lg:col-span-2" : ""
                )}
              >
                <div className="absolute inset-0 bg-[#171e19]/0 transition-colors duration-500 group-hover:bg-[#171e19]/80" />
                <div className="relative z-10 flex h-full w-full flex-col justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9f8d8b] group-hover:text-[#d5f4f9]">
                    Tool {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-5xl uppercase leading-none tracking-tight text-[#171e19] transition-colors duration-500 group-hover:text-white">
                    {tool}
                  </h3>
                </div>
                <div className="absolute right-5 top-5 flex h-16 w-16 scale-0 items-center justify-center rounded-full bg-white text-xs font-semibold uppercase text-[#171e19] transition-transform duration-500 group-hover:scale-100">
                  View
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    ["STEP 01", "Describe your idea."],
    ["STEP 02", "Choose your AI tool."],
    ["STEP 03", "Generate optimized prompts."]
  ];

  return (
    <section className="bg-[#171e19] px-4 py-24 text-white sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr]">
          <Reveal>
            <h2 className="font-display text-7xl uppercase leading-none tracking-tighter text-[#b7c6c2] sm:text-8xl">
              How It Works
            </h2>
          </Reveal>
          <div className="space-y-4">
            {steps.map(([label, title], index) => (
              <Reveal key={label} delay={index * 0.08}>
                <div className="grid gap-6 border-t border-white/15 py-10 md:grid-cols-[180px_1fr]">
                  <p className="text-sm font-semibold tracking-[0.35em] text-[#9f8d8b]">{label}</p>
                  <h3 className="font-display text-5xl uppercase leading-none tracking-tight sm:text-7xl">{title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  const flow = ["Idea", "Optimized Prompt", "PRD", "Database Schema", "API Design", "Development Roadmap"];

  return (
    <section id="templates" className="bg-white px-4 py-24 text-[#171e19] sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1800px]">
        <Reveal>
          <h2 className="max-w-6xl font-display text-7xl uppercase leading-none tracking-tighter sm:text-8xl lg:text-9xl">
            From Idea To Execution
          </h2>
        </Reveal>
        <div className="mt-20 grid gap-5 lg:grid-cols-12">
          {flow.map((item, index) => (
            <Reveal key={item} delay={index * 0.05} className={cn("lg:col-span-4", index % 2 === 1 ? "lg:translate-y-12" : "")}>
              <div className="relative min-h-56 rounded-lg border border-[#171e19]/10 bg-[#f7f5f1] p-6 shadow-sm transition-transform duration-500 hover:-translate-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9f8d8b]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-8 font-display text-5xl uppercase leading-none tracking-tight">{item}</h3>
                <p className="mt-6 text-sm font-light leading-6 text-[#302b2f]/70">
                  {index === 0
                    ? "Start with a rough product thought."
                    : "Convert intent into structured execution context."}
                </p>
                {index < flow.length - 1 ? (
                  <ArrowDown className="absolute -bottom-8 left-8 h-7 w-7 text-[#9f8d8b] lg:left-auto lg:right-8" aria-hidden="true" />
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-[#f1eee9] px-4 py-24 text-[#171e19] sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1800px]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#9f8d8b]">Platform Features</p>
          <h2 className="mt-6 max-w-5xl font-display text-7xl uppercase leading-none tracking-tighter sm:text-8xl">
            Built For The New AI Stack
          </h2>
        </Reveal>
        <div className="mt-20 grid gap-px overflow-hidden rounded-lg bg-[#171e19]/10 lg:grid-cols-12">
          {features.map((feature, index) => (
            <Reveal key={feature} delay={index * 0.05} className="bg-[#f7f5f1] lg:col-span-4">
              <article className="group min-h-72 p-8">
                <div className="h-px w-10 bg-[#171e19] transition-all duration-500 group-hover:w-16" />
                <h3 className="mt-10 font-display text-4xl uppercase leading-none tracking-tight">{feature}</h3>
                <p className="mt-6 text-sm font-light leading-6 text-[#302b2f]/70">
                  Production-grade intelligence for planning, adapting, and shipping prompts across AI tools.
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectPlannerSection() {
  return (
    <section className="bg-[#171e19] px-4 py-24 text-white sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <DashboardMockup />
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#b7c6c2]">Project Planner</p>
            <h2 className="mt-6 font-display text-6xl uppercase leading-none tracking-tighter sm:text-8xl">
              Turn Ideas Into Complete Project Blueprints
            </h2>
            <p className="mt-8 max-w-xl text-lg font-light leading-8 text-[#d7c5b2]">
              Generate PRDs, folder structures, APIs, database designs, architecture plans, and development roadmaps.
            </p>
            <Link href="/sign-up" className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em]">
              Plan a project
              <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-3" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const quotes = [
    "PromptForge makes Cursor and Claude Code feel like they share one brain.",
    "We went from vague feature notes to shippable specs in minutes.",
    "It is the prompt layer our engineering team did not know we needed."
  ];

  return (
    <section className="relative overflow-hidden bg-[#302b2f] px-4 py-24 text-white sm:px-8 lg:px-12 lg:py-32">
      <div aria-hidden="true" className="absolute -left-6 top-0 font-display text-[32rem] leading-none text-white/5">
        “
      </div>
      <div className="relative mx-auto max-w-[1800px]">
        <Reveal>
          <h2 className="font-display text-7xl uppercase leading-none tracking-tighter sm:text-8xl">Built For Developers</h2>
        </Reveal>
        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {quotes.map((quote, index) => (
            <Reveal key={quote} delay={index * 0.08}>
              <blockquote className="rounded-lg border border-white/10 bg-white/[0.03] p-8">
                <p className="font-display text-4xl uppercase leading-tight tracking-tight text-[#d5f4f9]">“{quote}”</p>
                <footer className="mt-8 text-sm font-light text-[#d7c5b2]">Senior AI engineer, SaaS team</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Explore tool-specific prompt generation.",
      perks: ["25 generations", "Basic templates", "Community tools"]
    },
    {
      name: "Pro",
      price: "$19",
      description: "For builders shipping AI-assisted products.",
      perks: ["Unlimited prompts", "Project planner", "Prompt library", "Priority tools"]
    },
    {
      name: "Team",
      price: "$49",
      description: "For teams standardizing AI development workflows.",
      perks: ["Shared libraries", "Analytics", "Team templates", "Admin controls"]
    }
  ];

  return (
    <section id="pricing" className="bg-white px-4 py-24 text-[#171e19] sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1800px]">
        <Reveal>
          <h2 className="font-display text-7xl uppercase leading-none tracking-tighter sm:text-8xl">Pricing</h2>
        </Reveal>
        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Reveal key={plan.name}>
              <article
                className={cn(
                  "rounded-lg border p-8",
                  plan.name === "Pro" ? "border-[#171e19] bg-[#171e19] text-white" : "border-[#171e19]/10 bg-[#f7f5f1]"
                )}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9f8d8b]">{plan.name}</p>
                <p className="mt-8 font-display text-7xl uppercase tracking-tight">
                  {plan.price}
                  <span className="font-body text-base font-light">/mo</span>
                </p>
                <p className={cn("mt-4 text-sm font-light leading-6", plan.name === "Pro" ? "text-[#d7c5b2]" : "text-[#302b2f]/70")}>
                  {plan.description}
                </p>
                <ul className="mt-8 space-y-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <LandingButton href="/sign-up" className="mt-10 w-full justify-center" variant={plan.name === "Pro" ? "light" : "dark"}>
                  Choose {plan.name}
                </LandingButton>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[#f1eee9] px-4 py-24 text-[#171e19] sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[0.75fr_1fr]">
        <Reveal>
          <h2 className="font-display text-7xl uppercase leading-none tracking-tighter sm:text-8xl">FAQ</h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.04}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-[#171e19]/10 bg-white p-6 text-left"
                aria-expanded={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-display text-3xl uppercase leading-none tracking-tight">{faq.question}</span>
                <ChevronDown className={cn("h-5 w-5 transition-transform duration-500", openIndex === index ? "rotate-180" : "")} />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 pt-3 text-sm font-light leading-7 text-[#302b2f]/75">{faq.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#171e19] px-4 py-24 text-white sm:px-8 lg:px-12 lg:py-32">
      <div aria-hidden="true" className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#d5f4f9]/20 blur-[120px]" />
      <Reveal className="relative mx-auto max-w-[1800px]">
        <h2 className="font-display text-[17vw] uppercase leading-[0.85] tracking-tighter">
          Start Building Smarter
        </h2>
        <p className="mt-8 max-w-2xl text-xl font-light text-[#d7c5b2]">Generate better prompts for every AI tool.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <LandingButton href="/sign-up">Get Started</LandingButton>
          <LandingButton href="/dashboard" variant="outline">
            View Demo
          </LandingButton>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#171e19] px-4 pb-8 pt-20 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1800px] border-t border-white/10 pt-10">
        <h2 className="font-display text-[18vw] uppercase leading-none tracking-tighter text-[#b7c6c2]">PromptForge AI</h2>
        <a href="mailto:hello@promptforge.ai" className="mt-8 inline-block text-3xl font-light text-[#d7c5b2] hover:text-white">
          hello@promptforge.ai
        </a>
        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 text-sm font-light text-white/70 sm:flex-row">
          <p>Copyright 2026 PromptForge AI. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <a href="/terms" className="transition-colors duration-500 hover:text-white">
              Terms
            </a>
            <a href="/privacy" className="transition-colors duration-500 hover:text-white">
              Privacy
            </a>
            <a href="/docs" className="transition-colors duration-500 hover:text-white">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DashboardMockup() {
  return (
    <div className="rounded-lg border border-white/10 bg-[#302b2f] p-3 shadow-2xl">
      <div className="rounded-md bg-[#f7f5f1] p-4 text-[#171e19]">
        <div className="grid gap-3 lg:grid-cols-[0.7fr_1fr]">
          <div className="rounded-md bg-[#171e19] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-[#b7c6c2]">PromptForge</p>
            <h3 className="mt-8 font-display text-5xl uppercase leading-none">Blueprint</h3>
            <div className="mt-10 space-y-3">
              {["PRD", "Schema", "Routes", "Roadmap"].map((item) => (
                <div key={item} className="rounded border border-white/10 px-3 py-2 text-sm text-[#d7c5b2]">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {["Idea intake", "Tool context", "Optimized prompt", "Execution plan"].map((item, index) => (
              <div key={item} className="rounded-md border border-[#171e19]/10 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9f8d8b]">Stage {index + 1}</p>
                <p className="mt-3 font-display text-3xl uppercase leading-none">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
  as = "div"
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const Component = as === "span" ? motion.span : motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease }}
      className={className}
    >
      {children}
    </Component>
  );
}

function LandingButton({
  href,
  children,
  variant = "solid",
  className
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-semibold transition-all duration-500",
        variant === "solid" && "border-white bg-white text-[#171e19] hover:bg-[#d5f4f9]",
        variant === "outline" && "border-white/40 text-white hover:border-white hover:bg-white hover:text-[#171e19]",
        variant === "dark" && "border-[#171e19] bg-[#171e19] text-white hover:bg-[#302b2f]",
        variant === "light" && "border-white bg-white text-[#171e19] hover:bg-[#d5f4f9]",
        className
      )}
    >
      {children}
    </Link>
  );
}
