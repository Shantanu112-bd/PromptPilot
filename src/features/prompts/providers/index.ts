import "server-only";

export { generatePrompt, getProvider, registerProvider } from "@/features/prompts/providers/provider-switcher";
export { GeminiProvider } from "@/features/prompts/providers/gemini";
export { GroqProvider } from "@/features/prompts/providers/groq";
export { OpenRouterProvider } from "@/features/prompts/providers/openrouter";
export { TogetherProvider } from "@/features/prompts/providers/together";
export { AIProviderError } from "@/features/prompts/providers/types";
export type {
  AIProvider,
  AIProviderName,
  GeneratePromptInput,
  GeneratePromptOutput,
  ProviderConfig
} from "@/features/prompts/providers/types";
