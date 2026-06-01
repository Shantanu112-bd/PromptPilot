import { assertApiKey, fetchWithTimeout, parseProviderResponse } from "@/features/prompts/providers/http";
import { withRetry } from "@/features/prompts/providers/retry";
import type { AIProvider, GeneratePromptInput, GeneratePromptOutput, ProviderConfig } from "@/features/prompts/providers/types";

type TogetherResponse = {
  model?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

export class TogetherProvider implements AIProvider {
  readonly name = "together";
  readonly defaultModel: string;

  constructor(private readonly config: ProviderConfig) {
    this.defaultModel = config.defaultModel;
  }

  async generatePrompt(input: GeneratePromptInput): Promise<GeneratePromptOutput> {
    assertApiKey(this.config.apiKey, this.name);

    return withRetry(async () => {
      const response = await fetchWithTimeout(`${this.config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: input.model ?? this.defaultModel,
          temperature: input.temperature ?? 0.7,
          max_tokens: input.maxTokens,
          messages: [
            ...(input.systemPrompt ? [{ role: "system", content: input.systemPrompt }] : []),
            { role: "user", content: input.prompt }
          ]
        })
      });

      const body = await parseProviderResponse<TogetherResponse>(response, this.name);
      const text = body.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("Together AI returned an empty response.");
      }

      return {
        provider: this.name,
        model: body.model ?? input.model ?? this.defaultModel,
        text,
        usage: {
          inputTokens: body.usage?.prompt_tokens,
          outputTokens: body.usage?.completion_tokens,
          totalTokens: body.usage?.total_tokens
        },
        raw: body
      };
    });
  }
}
