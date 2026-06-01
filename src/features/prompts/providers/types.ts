export type AIProviderName = "openrouter" | "groq" | "gemini" | "together";

export type GeneratePromptInput = {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, string | number | boolean>;
};

export type GeneratePromptOutput = {
  provider: AIProviderName;
  model: string;
  text: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  raw?: unknown;
};

export interface AIProvider {
  readonly name: AIProviderName;
  readonly defaultModel: string;
  generatePrompt(input: GeneratePromptInput): Promise<GeneratePromptOutput>;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: AIProviderName,
    public readonly status?: number,
    public readonly retryable = false,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

export type ProviderConfig = {
  apiKey?: string;
  baseUrl: string;
  defaultModel: string;
};
