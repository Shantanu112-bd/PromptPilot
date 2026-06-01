import { assertApiKey, fetchWithTimeout, parseProviderResponse } from "@/features/prompts/providers/http";
import { withRetry } from "@/features/prompts/providers/retry";
import type { AIProvider, GeneratePromptInput, GeneratePromptOutput, ProviderConfig } from "@/features/prompts/providers/types";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
};

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  readonly defaultModel: string;

  constructor(private readonly config: ProviderConfig) {
    this.defaultModel = config.defaultModel;
  }

  async generatePrompt(input: GeneratePromptInput): Promise<GeneratePromptOutput> {
    assertApiKey(this.config.apiKey, this.name);

    return withRetry(async () => {
      const model = input.model ?? this.defaultModel;
      const response = await fetchWithTimeout(`${this.config.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: input.systemPrompt
            ? {
                parts: [{ text: input.systemPrompt }]
              }
            : undefined,
          contents: [
            {
              role: "user",
              parts: [{ text: input.prompt }]
            }
          ],
          generationConfig: {
            temperature: input.temperature ?? 0.7,
            maxOutputTokens: input.maxTokens
          }
        })
      });

      const body = await parseProviderResponse<GeminiResponse>(response, this.name);
      const text = body.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n");

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      return {
        provider: this.name,
        model,
        text,
        usage: {
          inputTokens: body.usageMetadata?.promptTokenCount,
          outputTokens: body.usageMetadata?.candidatesTokenCount,
          totalTokens: body.usageMetadata?.totalTokenCount
        },
        raw: body
      };
    });
  }
}
