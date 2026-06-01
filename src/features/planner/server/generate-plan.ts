"use server";

import { z } from "zod";
import { requireSession } from "@/features/auth/server/get-session";
import { generatePrompt } from "@/features/prompts/providers/provider-switcher";
import { type ActionResponse } from "@/lib/types/action";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { trackGeneration } from "@/features/prompts/server/track-generation";

const generatePlanSchema = z.object({
  idea: z.string().min(10, "Idea must be at least 10 characters long.")
});

export type ProjectPlanResult = {
  prd: string;
  folderStructure: string;
  databaseDesign: string;
  apiDesign: string;
  roadmap: string;
  deployment: string;
};

export async function generateProjectPlanAction(
  data: z.infer<typeof generatePlanSchema>
): Promise<ActionResponse<ProjectPlanResult>> {
  try {
    const session = await requireSession();
    
    if (!checkRateLimit(session.user.id, 10000)) { // 10 seconds limit for large plan generation
      return { ok: false, error: "Please wait 10 seconds before generating another plan." };
    }

    const validated = generatePlanSchema.parse(data);

    const systemPrompt = `You are an elite Senior Software Architect and Product Manager.
Your task is to take a raw project idea from a user and construct a comprehensive, highly detailed software architecture and project plan.

You MUST format your entire response as a single, valid JSON object with the following string keys containing markdown-formatted content:
{
  "prd": "Product Requirements Document including target audience, user stories, and core features in markdown.",
  "folderStructure": "A tree-like representation of the optimal codebase structure, plus explanations for key directories in markdown.",
  "databaseDesign": "Schema design, tables, relations, and a brief description of the data model in markdown.",
  "apiDesign": "REST or GraphQL API endpoints, request/response formats, and authentication strategy in markdown.",
  "roadmap": "A phased development plan (Phase 1, Phase 2, etc.) in markdown.",
  "deployment": "Infrastructure, CI/CD, and deployment strategy in markdown."
}

CRITICAL RULES:
1. ONLY return valid JSON. Do not include markdown code block wrappers (like \`\`\`json) around your response.
2. Ensure you escape internal quotes properly.
3. Be highly technical, pragmatic, and detailed in your markdown content. Use tables, bolding, and code blocks within the markdown strings where appropriate.`;

    const userPrompt = `Project Idea:\n---\n${validated.idea}\n---`;

    const startTime = Date.now();
    const result = await generatePrompt({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.2,
      maxTokens: 4000
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

    if (
      typeof parsed.prd !== "string" ||
      typeof parsed.folderStructure !== "string" ||
      typeof parsed.databaseDesign !== "string" ||
      typeof parsed.apiDesign !== "string" ||
      typeof parsed.roadmap !== "string" ||
      typeof parsed.deployment !== "string"
    ) {
      throw new Error("AI returned malformed JSON structure.");
    }

    // Fire-and-forget: record the generation for audit trail
    trackGeneration({
      userId: session.user.id,
      input: validated.idea,
      output: result,
      latencyMs
    });

    return { ok: true, data: parsed as ProjectPlanResult };
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

    console.error("Failed to generate project plan:", message);
    return { ok: false, error: `Failed to generate project plan: ${message}` };
  }
}
