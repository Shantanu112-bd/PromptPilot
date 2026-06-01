import { PrismaClient, ProviderStatus } from "@prisma/client";

const prisma = new PrismaClient();

const tools = [
  {
    name: "ChatGPT",
    slug: "chatgpt",
    description: "OpenAI's conversational AI workspace for prompting, research, and content generation.",
    websiteUrl: "https://chatgpt.com"
  },
  {
    name: "Claude",
    slug: "claude",
    description: "Anthropic's AI assistant for reasoning, writing, coding, and analysis.",
    websiteUrl: "https://claude.ai"
  },
  {
    name: "Gemini",
    slug: "gemini",
    description: "Google's multimodal AI assistant for search, writing, coding, and productivity.",
    websiteUrl: "https://gemini.google.com"
  },
  {
    name: "Cursor",
    slug: "cursor",
    description: "AI-native code editor for software development workflows.",
    websiteUrl: "https://cursor.com"
  },
  {
    name: "Claude Code",
    slug: "claude-code",
    description: "Anthropic's agentic coding tool for terminal-based software engineering.",
    websiteUrl: "https://www.anthropic.com/claude-code"
  },
  {
    name: "Copilot",
    slug: "copilot",
    description: "GitHub's AI coding assistant for IDE and repository workflows.",
    websiteUrl: "https://github.com/features/copilot"
  },
  {
    name: "Windsurf",
    slug: "windsurf",
    description: "Agentic AI code editor for building and refactoring software.",
    websiteUrl: "https://windsurf.com"
  },
  {
    name: "Warp",
    slug: "warp",
    description: "AI-powered terminal and developer workflow environment.",
    websiteUrl: "https://www.warp.dev"
  },
  {
    name: "Bolt",
    slug: "bolt",
    description: "AI app builder for rapidly creating web applications.",
    websiteUrl: "https://bolt.new"
  },
  {
    name: "Lovable",
    slug: "lovable",
    description: "AI product builder for turning prompts into full-stack applications.",
    websiteUrl: "https://lovable.dev"
  },
  {
    name: "Replit",
    slug: "replit",
    description: "Cloud development platform with AI-assisted app creation and coding.",
    websiteUrl: "https://replit.com"
  },
  {
    name: "DeepSeek",
    slug: "deepseek",
    description: "AI assistant and model platform focused on reasoning and coding workflows.",
    websiteUrl: "https://www.deepseek.com"
  }
] as const;

const aiProviders = [
  {
    name: "OpenAI",
    slug: "openai",
    description: "AI provider behind GPT models and ChatGPT.",
    websiteUrl: "https://openai.com",
    apiBaseUrl: "https://api.openai.com/v1"
  },
  {
    name: "Anthropic",
    slug: "anthropic",
    description: "AI provider behind Claude models.",
    websiteUrl: "https://www.anthropic.com",
    apiBaseUrl: "https://api.anthropic.com"
  },
  {
    name: "Google",
    slug: "google",
    description: "AI provider behind Gemini models.",
    websiteUrl: "https://ai.google.dev",
    apiBaseUrl: undefined
  },
  {
    name: "DeepSeek",
    slug: "deepseek",
    description: "AI provider behind DeepSeek models.",
    websiteUrl: "https://www.deepseek.com",
    apiBaseUrl: "https://api.deepseek.com"
  },
  {
    name: "Meta",
    slug: "meta",
    description: "AI provider behind Llama models.",
    websiteUrl: "https://ai.meta.com",
    apiBaseUrl: undefined
  },
  {
    name: "Alibaba Cloud",
    slug: "alibaba-cloud",
    description: "AI provider behind Qwen models.",
    websiteUrl: "https://www.alibabacloud.com",
    apiBaseUrl: undefined
  },
  {
    name: "Mistral AI",
    slug: "mistral-ai",
    description: "AI provider behind Mistral models.",
    websiteUrl: "https://mistral.ai",
    apiBaseUrl: "https://api.mistral.ai"
  }
] as const;

const models = [
  {
    name: "GPT",
    slug: "gpt",
    displayName: "GPT",
    description: "General-purpose GPT model family for reasoning, writing, coding, and multimodal workflows.",
    providerSlug: "openai",
    capabilities: ["reasoning", "writing", "coding", "multimodal"]
  },
  {
    name: "Claude Sonnet",
    slug: "claude-sonnet",
    displayName: "Claude Sonnet",
    description: "Balanced Claude model family for fast reasoning, coding, and content workflows.",
    providerSlug: "anthropic",
    capabilities: ["reasoning", "writing", "coding"]
  },
  {
    name: "Claude Opus",
    slug: "claude-opus",
    displayName: "Claude Opus",
    description: "High-capability Claude model family for complex reasoning and advanced tasks.",
    providerSlug: "anthropic",
    capabilities: ["advanced-reasoning", "coding", "analysis"]
  },
  {
    name: "Gemini",
    slug: "gemini",
    displayName: "Gemini",
    description: "Google Gemini model family for multimodal reasoning, writing, and coding.",
    providerSlug: "google",
    capabilities: ["reasoning", "writing", "coding", "multimodal"]
  },
  {
    name: "DeepSeek",
    slug: "deepseek",
    displayName: "DeepSeek",
    description: "DeepSeek model family for reasoning, coding, and technical problem solving.",
    providerSlug: "deepseek",
    capabilities: ["reasoning", "coding"]
  },
  {
    name: "Llama",
    slug: "llama",
    displayName: "Llama",
    description: "Meta Llama model family for open and customizable AI workflows.",
    providerSlug: "meta",
    capabilities: ["reasoning", "writing", "coding"]
  },
  {
    name: "Qwen",
    slug: "qwen",
    displayName: "Qwen",
    description: "Qwen model family for multilingual reasoning, coding, and agent workflows.",
    providerSlug: "alibaba-cloud",
    capabilities: ["reasoning", "coding", "multilingual"]
  },
  {
    name: "Mistral",
    slug: "mistral",
    displayName: "Mistral",
    description: "Mistral model family for efficient reasoning, coding, and text generation.",
    providerSlug: "mistral-ai",
    capabilities: ["reasoning", "writing", "coding"]
  }
] as const;

const categories = [
  {
    name: "Full Stack",
    slug: "full-stack",
    description: "Prompts for end-to-end product development across frontend, backend, and infrastructure."
  },
  {
    name: "AI Apps",
    slug: "ai-apps",
    description: "Prompts for building applications powered by AI models, agents, and workflows."
  },
  {
    name: "SaaS",
    slug: "saas",
    description: "Prompts for subscription products, dashboards, billing, onboarding, and growth flows."
  },
  {
    name: "APIs",
    slug: "apis",
    description: "Prompts for designing, documenting, testing, and integrating APIs."
  },
  {
    name: "Debugging",
    slug: "debugging",
    description: "Prompts for diagnosing bugs, production issues, regressions, and runtime failures."
  },
  {
    name: "Testing",
    slug: "testing",
    description: "Prompts for unit, integration, end-to-end, accessibility, and regression testing."
  },
  {
    name: "Refactoring",
    slug: "refactoring",
    description: "Prompts for improving structure, maintainability, performance, and readability."
  },
  {
    name: "Documentation",
    slug: "documentation",
    description: "Prompts for technical docs, API references, onboarding guides, and release notes."
  }
] as const;

async function seedTools() {
  await Promise.all(
    tools.map((tool) =>
      prisma.tool.upsert({
        where: { slug: tool.slug },
        update: {
          name: tool.name,
          description: tool.description,
          websiteUrl: tool.websiteUrl,
          deletedAt: null
        },
        create: tool
      })
    )
  );
}

async function seedAIProviders() {
  const providers = await Promise.all(
    aiProviders.map((provider) =>
      prisma.aIProvider.upsert({
        where: { slug: provider.slug },
        update: {
          name: provider.name,
          description: provider.description,
          websiteUrl: provider.websiteUrl,
          apiBaseUrl: provider.apiBaseUrl,
          status: ProviderStatus.ACTIVE,
          deletedAt: null
        },
        create: {
          ...provider,
          status: ProviderStatus.ACTIVE
        }
      })
    )
  );

  return new Map(providers.map((provider) => [provider.slug, provider.id]));
}

async function seedModels(providerIdsBySlug: Map<string, string>) {
  for (const model of models) {
    const providerId = providerIdsBySlug.get(model.providerSlug);

    if (!providerId) {
      throw new Error(`Missing AI provider for model: ${model.name}`);
    }

    await prisma.model.upsert({
      where: {
        aiProviderId_slug: {
          aiProviderId: providerId,
          slug: model.slug
        }
      },
      update: {
        name: model.name,
        displayName: model.displayName,
        description: model.description,
        capabilities: [...model.capabilities],
        isActive: true,
        deletedAt: null
      },
      create: {
        name: model.name,
        slug: model.slug,
        displayName: model.displayName,
        description: model.description,
        capabilities: [...model.capabilities],
        aiProviderId: providerId
      }
    });
  }
}

async function seedCategories() {
  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          deletedAt: null
        },
        create: category
      })
    )
  );
}

const toolIntelligenceData = [
  {
    toolSlug: "cursor",
    promptStyle: "Context-heavy, declarative, file-specific",
    contextWindow: 128000,
    bestPractices: ["Reference files using @", "Give exact line ranges when possible", "Keep rules in .cursorrules"],
    outputStructure: "Direct code replacements or unified diffs",
    recommendedTechniques: ["Multi-file editing", "Agentic refactoring", "Inline command generation"]
  },
  {
    toolSlug: "claude-code",
    promptStyle: "Agentic, step-by-step, terminal-focused",
    contextWindow: 200000,
    bestPractices: ["Provide a clear goal", "Let it explore the workspace", "Use precise acceptance criteria"],
    outputStructure: "Iterative bash commands and file writes",
    recommendedTechniques: ["Test-driven loop", "Autonomous planning", "Self-correction"]
  },
  {
    toolSlug: "copilot",
    promptStyle: "Context-aware, completion-oriented, chat-based",
    contextWindow: 32000,
    bestPractices: ["Use #workspace to gather broad context", "Keep requests scoped to current file", "Write clear comments to guide autocomplete"],
    outputStructure: "Inline code suggestions, small refactors",
    recommendedTechniques: ["Comment-driven development", "Interactive chat refinements"]
  },
  {
    toolSlug: "bolt",
    promptStyle: "Project-scoped, descriptive, framework-aware",
    contextWindow: 64000,
    bestPractices: ["Specify tech stack immediately", "Describe UI layout before logic", "Prompt for full features rather than snippets"],
    outputStructure: "Full-stack application templates, multi-file generation",
    recommendedTechniques: ["Iterative UI refinement", "Rapid prototyping"]
  },
  {
    toolSlug: "warp",
    promptStyle: "Terminal-centric, bash-focused, concise",
    contextWindow: 16000,
    bestPractices: ["Ask for exact commands", "Provide OS/environment context", "Use warp AI for complex jq/awk pipelines"],
    outputStructure: "Executable shell commands",
    recommendedTechniques: ["Command explanation", "Error output debugging"]
  },
  {
    toolSlug: "windsurf",
    promptStyle: "Agentic, multi-step, contextual",
    contextWindow: 200000,
    bestPractices: ["Leverage Cascade for deep context", "Provide an initial implementation plan", "Use for large scale refactors"],
    outputStructure: "File edits and terminal execution",
    recommendedTechniques: ["Plan-execute loops", "Cross-file dependency updates"]
  },
  {
    toolSlug: "gemini",
    promptStyle: "Analytical, multimodal, large-context",
    contextWindow: 2000000,
    bestPractices: ["Use for massive codebases", "Include diagrams or images if helpful", "Ask for reasoning before code"],
    outputStructure: "Detailed explanations, code blocks",
    recommendedTechniques: ["Few-shot prompting", "Chain of thought"]
  },
  {
    toolSlug: "chatgpt",
    promptStyle: "Conversational, iterative, structured",
    contextWindow: 128000,
    bestPractices: ["Define persona", "Use markdown formatting in prompts", "Iterate through chat history"],
    outputStructure: "Markdown with code blocks",
    recommendedTechniques: ["Role-playing", "Step-by-step reasoning"]
  },
  {
    toolSlug: "deepseek",
    promptStyle: "Direct, technical, logic-heavy",
    contextWindow: 128000,
    bestPractices: ["Ask for optimal algorithms", "Skip pleasantries", "Provide strict constraints"],
    outputStructure: "Optimized code, mathematical proofs, performance metrics",
    recommendedTechniques: ["Algorithmic optimization", "Complex logic resolution"]
  },
  {
    toolSlug: "replit",
    promptStyle: "Cloud-native, interactive, immediate",
    contextWindow: 128000,
    bestPractices: ["Use Replit Agent for full setup", "Ask to configure Nix environment", "Prompt for deployment ready code"],
    outputStructure: "Running application environments",
    recommendedTechniques: ["Zero-to-deploy generation", "Environment setup debugging"]
  },
  {
    toolSlug: "lovable",
    promptStyle: "Design-first, product-focused, visual",
    contextWindow: 128000,
    bestPractices: ["Describe exact user flows", "Specify design system preferences", "Provide layout constraints"],
    outputStructure: "Full-stack React/Node applications with rich UI",
    recommendedTechniques: ["Visual feedback iteration", "Component-driven design"]
  }
];

async function seedToolIntelligence() {
  const allTools = await prisma.tool.findMany();
  
  await Promise.all(
    toolIntelligenceData.map(async (data) => {
      const tool = allTools.find(t => t.slug === data.toolSlug);
      if (!tool) return;
      
      return prisma.toolIntelligence.upsert({
        where: { toolId: tool.id },
        update: {
          promptStyle: data.promptStyle,
          contextWindow: data.contextWindow,
          bestPractices: data.bestPractices,
          outputStructure: data.outputStructure,
          recommendedTechniques: data.recommendedTechniques
        },
        create: {
          toolId: tool.id,
          promptStyle: data.promptStyle,
          contextWindow: data.contextWindow,
          bestPractices: data.bestPractices,
          outputStructure: data.outputStructure,
          recommendedTechniques: data.recommendedTechniques
        }
      });
    })
  );
}


async function main() {
  console.info("Seeding PromptForge AI reference data...");

  await seedTools();
  const providerIdsBySlug = await seedAIProviders();
  await seedModels(providerIdsBySlug);
  await seedCategories();
  await seedToolIntelligence();

  console.info("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
