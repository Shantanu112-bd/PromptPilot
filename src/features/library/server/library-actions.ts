"use server";

import { type ActionResponse } from "@/lib/types/action";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

/**
 * Retrieves all saved prompts for the current user.
 * Supports basic text search and tag filtering.
 */
export async function getLibraryPrompts(query?: string, tags?: string[]) {
  const session = await requireSession();

  const savedPrompts = await prisma.savedPrompt.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null,
      prompt: {
        deletedAt: null,
        ...(query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        } : {}),
        ...(tags && tags.length > 0 ? {
          tags: { hasSome: tags }
        } : {})
      }
    },
    include: {
      prompt: {
        include: {
          category: true,
          tool: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return savedPrompts;
}

/**
 * Toggles the favorite status of a saved prompt.
 */
export async function toggleFavoritePrompt(savedPromptId: string, isFavorite: boolean): Promise<ActionResponse<{ isFavorite: boolean }>> {
  const session = await requireSession();

  const savedPrompt = await prisma.savedPrompt.findUnique({
    where: { id: savedPromptId }
  });

  if (!savedPrompt || savedPrompt.userId !== session.user.id) {
    throw new Error("Unauthorized or prompt not found.");
  }

  await prisma.savedPrompt.update({
    where: { id: savedPromptId },
    data: { isFavorite }
  });

  revalidatePath("/dashboard/library");
  return { ok: true, data: { isFavorite } };
}

/**
 * Get user's generation history
 */
export async function getGenerationHistory() {
  const session = await requireSession();

  return await prisma.generationHistory.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null
    },
    include: {
      tool: true,
      model: true,
      aiProvider: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50 // limit to recent 50 for performance
  });
}

/**
 * Get user's prompt collections
 */
export async function getPromptCollections() {
  const session = await requireSession();

  return await prisma.promptCollection.findMany({
    where: {
      ownerId: session.user.id,
      deletedAt: null
    },
    include: {
      prompts: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}
