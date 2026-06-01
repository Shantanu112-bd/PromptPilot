"use server";

import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const savePromptSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
});

import { type ActionResponse } from "@/lib/types/action";

export async function savePromptAction(formData: z.infer<typeof savePromptSchema>): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await requireSession();
    const validated = savePromptSchema.parse(formData);

    // Auto-generate slug from title
    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const prompt = await prisma.$transaction(async (tx) => {
      const p = await tx.prompt.create({
        data: {
          title: validated.title,
          slug,
          description: validated.description ?? "Generated via Prompt Generator",
          content: validated.content,
          metadata: validated.metadata ?? {},
          ownerId: session.user.id,
          status: "PUBLISHED",
          visibility: "PRIVATE"
        }
      });

      await tx.promptVersion.create({
        data: {
          promptId: p.id,
          authorId: session.user.id,
          version: 1,
          title: validated.title,
          content: validated.content,
          changelog: "Initial creation"
        }
      });

      return p;
    });

    return { ok: true, data: { id: prompt.id } };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to save prompt:", message);
    return { ok: false, error: "Failed to save prompt. Please try again." };
  }
}
