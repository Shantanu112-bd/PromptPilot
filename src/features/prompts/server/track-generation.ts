"use server";

import { prisma } from "@/lib/db/prisma";
import type { GeneratePromptOutput } from "@/features/prompts/providers/types";

type TrackGenerationInput = {
  userId: string;
  input: string;
  output: GeneratePromptOutput;
  promptId?: string;
  toolId?: string;
  modelId?: string;
  aiProviderId?: string;
  latencyMs?: number;
};

/**
 * Records an AI generation event to the GenerationHistory table.
 * This runs fire-and-forget after the main response is returned to avoid
 * blocking the user. Errors are logged but never thrown to the caller.
 */
export async function trackGeneration(params: TrackGenerationInput): Promise<void> {
  try {
    await prisma.generationHistory.create({
      data: {
        userId: params.userId,
        promptId: params.promptId,
        toolId: params.toolId,
        modelId: params.modelId,
        aiProviderId: params.aiProviderId,
        input: params.input,
        output: params.output.text,
        status: "COMPLETED",
        inputTokens: params.output.usage?.inputTokens ?? 0,
        outputTokens: params.output.usage?.outputTokens ?? 0,
        latencyMs: params.latencyMs,
        metadata: {
          provider: params.output.provider,
          model: params.output.model
        }
      }
    });
  } catch (error) {
    // Never throw — this is a non-blocking side effect.
    // In production, this should go to a structured logger (e.g., Axiom, Datadog).
    console.error("[trackGeneration] Failed to record generation history:", error);
  }
}
