"use server";

import { z } from "zod";
import { requireSession } from "@/features/auth/server/get-session";
import { generatePrompt } from "@/features/prompts/providers/provider-switcher";
import { type ActionResponse } from "@/lib/types/action";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { trackGeneration } from "@/features/prompts/server/track-generation";

const analyzePromptSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters long.")
});

export type PromptAnalysisResult = {
  improvedPrompt: string;
  qualityScore: number;
  analysis: {
    clarity: string[];
    context: string[];
    constraints: string[];
    structure: string[];
  };
};

export async function analyzePromptAction(formData: z.infer<typeof analyzePromptSchema>): Promise<ActionResponse<PromptAnalysisResult>> {
  try {
    const session = await requireSession();
    
    if (!checkRateLimit(session.user.id, 5000)) { // 5 seconds limit for prompt analysis
      return { ok: false, error: "Please wait a moment before analyzing another prompt." };
    }

    const validated = analyzePromptSchema.parse(formData);

    const systemPrompt = `You are a world-class prompt engineer and AI assistant. Your task is to analyze the provided user prompt and output a STRICT JSON object representing your analysis and improvements.

Analyze the prompt across four dimensions:
1. Clarity (How clear and unambiguous is the prompt?)
2. Context (Does it provide enough background information?)
3. Constraints (Are the rules and limits well-defined?)
4. Structure (Is the prompt organized logically?)

Provide an overall qualityScore out of 100.
Provide an improvedPrompt that is production-ready, highly structured, and addresses the weaknesses.

You MUST respond ONLY with a valid JSON object. No markdown formatting outside the JSON, no markdown code blocks (do NOT use \`\`\`json). Just the raw JSON object.
Schema:
{
  "qualityScore": number,
  "improvedPrompt": "string",
  "analysis": {
    "clarity": ["string"],
    "context": ["string"],
    "constraints": ["string"],
    "structure": ["string"]
  }
}`;

    const userPrompt = `Prompt to analyze:\n---\n${validated.prompt}\n---`;

    const startTime = Date.now();
    const result = await generatePrompt({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.1
    });
    const latencyMs = Date.now() - startTime;

    let jsonString = result.text.trim();
    // Clean up potential markdown formatting if the model disobeys
    if (jsonString.startsWith("\`\`\`json")) {
      jsonString = jsonString.replace(/^\`\`\`json\n?/, "");
    }
    if (jsonString.startsWith("\`\`\`")) {
      jsonString = jsonString.replace(/^\`\`\`\n?/, "");
    }
    if (jsonString.endsWith("\`\`\`")) {
      jsonString = jsonString.replace(/\n?\`\`\`$/, "");
    }

    const parsed = JSON.parse(jsonString);

    // Basic validation of the parsed JSON
    if (
      typeof parsed.qualityScore !== "number" ||
      typeof parsed.improvedPrompt !== "string" ||
      !parsed.analysis
    ) {
      throw new Error("AI returned malformed JSON structure.");
    }

    trackGeneration({
      userId: session.user.id,
      input: validated.prompt,
      output: result,
      latencyMs
    });

    return { ok: true, data: parsed as PromptAnalysisResult };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to analyze prompt:", message);
    return { ok: false, error: "Failed to analyze prompt. Please try again." };
  }
}
