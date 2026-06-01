"use server";

import { z } from "zod";
import { requireSession } from "@/features/auth/server/get-session";
import { generatePrompt } from "@/features/prompts/providers/provider-switcher";
import { type ActionResponse } from "@/lib/types/action";
import { checkRateLimit } from "@/lib/utils/rate-limit";

const improvePromptSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters."),
  goal: z.string().optional()
});

export async function improvePromptAction(
  formData: z.infer<typeof improvePromptSchema>
): Promise<ActionResponse<{ improvedPrompt: string }>> {
  try {
    const session = await requireSession();

    if (!checkRateLimit(session.user.id, 5000)) {
      return { ok: false, error: "Please wait a moment before improving another prompt." };
    }

    const validated = improvePromptSchema.parse(formData);

    const systemPrompt = `You are a world-class prompt engineer. 
Analyze the provided user prompt and significantly enhance it for production-grade coding.
Follow these rules strictly:
- Make it highly structured, detailed, clear, and unambiguous.
- Retain the original intent, tool selection, and framework constraints.
- Inject professional best practices (type safety, responsive CSS design, error states, and testing).
- Return ONLY the absolute improved prompt code/text. 
- Do NOT wrap your response in chat pleasantries or explanation text. Just return the prompt directly.`;

    const userPrompt = `Target Goal of the Prompt: ${validated.goal ?? "Optimize and refine the prompt code below."}

Prompt to improve:
---
${validated.prompt}
---`;

    const result = await generatePrompt({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.2
    });

    return { ok: true, data: { improvedPrompt: result.text.trim() } };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // Write error to local workspace log for diagnostic access
    const errorData = {
      message,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };
    try {
      require("fs").writeFileSync("./error-log.json", JSON.stringify(errorData, null, 2));
    } catch (e) {}

    console.error("Failed to improve prompt:", message);
    return { ok: false, error: `Failed to improve prompt: ${message}` };
  }
}
