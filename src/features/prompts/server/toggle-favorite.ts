"use server";

import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { type ActionResponse } from "@/lib/types/action";
import { z } from "zod";

const toggleFavoriteSchema = z.object({
  promptId: z.string().uuid("Invalid prompt ID")
});

export async function toggleFavoriteAction(
  promptId: string
): Promise<ActionResponse<{ isFavorite: boolean }>> {
  try {
    const session = await requireSession();
    const validated = toggleFavoriteSchema.parse({ promptId });

    // Ensure prompt exists and belongs to user (or is public/team, but let's assume they can favorite any prompt they can see)
    // For simplicity, we just look up the prompt. 
    const prompt = await prisma.prompt.findUnique({
      where: { id: validated.promptId }
    });

    if (!prompt) {
      return { ok: false, error: "Prompt not found" };
    }

    // Check if SavedPrompt exists
    const existing = await prisma.savedPrompt.findUnique({
      where: {
        userId_promptId: {
          userId: session.user.id,
          promptId: validated.promptId
        }
      }
    });

    let isFavorite = false;

    if (existing) {
      // Toggle
      const updated = await prisma.savedPrompt.update({
        where: { id: existing.id },
        data: { isFavorite: !existing.isFavorite }
      });
      isFavorite = updated.isFavorite;
    } else {
      // Create
      const created = await prisma.savedPrompt.create({
        data: {
          userId: session.user.id,
          promptId: validated.promptId,
          isFavorite: true
        }
      });
      isFavorite = created.isFavorite;
    }

    return { ok: true, data: { isFavorite } };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to toggle favorite:", message);
    return { ok: false, error: "Failed to update favorite status." };
  }
}
