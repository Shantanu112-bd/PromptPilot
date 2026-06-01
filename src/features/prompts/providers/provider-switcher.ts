import "server-only";

import { GeminiProvider } from "@/features/prompts/providers/gemini";
import { GroqProvider } from "@/features/prompts/providers/groq";
import { OpenRouterProvider } from "@/features/prompts/providers/openrouter";
import { TogetherProvider } from "@/features/prompts/providers/together";
import { AIProviderError, type AIProvider, type AIProviderName, type GeneratePromptInput, type GeneratePromptOutput } from "@/features/prompts/providers/types";

type ProviderSwitcherOptions = {
  preferredProvider?: AIProviderName;
  fallbackProviders?: AIProviderName[];
};

const defaultProviderOrder: AIProviderName[] = ["gemini", "groq", "openrouter", "together"];

const providers: Record<AIProviderName, AIProvider> = {
  openrouter: new OpenRouterProvider({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    defaultModel: process.env.OPENROUTER_DEFAULT_MODEL ?? "openai/gpt-4o-mini"
  }),
  groq: new GroqProvider({
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
    defaultModel: process.env.GROQ_DEFAULT_MODEL ?? "llama-3.1-8b-instant"
  }),
  gemini: new GeminiProvider({
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-2.0-flash"
  }),
  together: new TogetherProvider({
    apiKey: process.env.TOGETHER_API_KEY,
    baseUrl: process.env.TOGETHER_BASE_URL ?? "https://api.together.xyz/v1",
    defaultModel: process.env.TOGETHER_DEFAULT_MODEL ?? "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"
  })
};

export async function generatePrompt(
  input: GeneratePromptInput,
  options: ProviderSwitcherOptions = {}
): Promise<GeneratePromptOutput> {
  const providerOrder = buildProviderOrder(options);
  const errors: AIProviderError[] = [];

  for (const providerName of providerOrder) {
    const provider = providers[providerName];

    try {
      return await provider.generatePrompt(input);
    } catch (error) {
      const providerError = normalizeProviderError(error, providerName);
      errors.push(providerError);

      if (!providerError.retryable && providerError.status !== undefined && providerError.status < 500) {
        continue;
      }
    }
  }

  throw new AIProviderError(
    `All AI providers failed: ${errors.map((error) => `${error.provider}: ${error.message}`).join("; ")}`,
    options.preferredProvider ?? providerOrder[0],
    undefined,
    false,
    errors
  );
}

export function getProvider(name: AIProviderName) {
  return providers[name];
}

export function registerProvider(provider: AIProvider) {
  providers[provider.name] = provider;
}

function buildProviderOrder(options: ProviderSwitcherOptions) {
  const ordered = [
    ...(options.preferredProvider ? [options.preferredProvider] : []),
    ...(options.fallbackProviders ?? defaultProviderOrder)
  ];

  return Array.from(new Set(ordered));
}

function normalizeProviderError(error: unknown, provider: AIProviderName) {
  if (error instanceof AIProviderError) {
    return error;
  }

  return new AIProviderError(
    error instanceof Error ? error.message : "Unknown AI provider error.",
    provider,
    undefined,
    false,
    error
  );
}
