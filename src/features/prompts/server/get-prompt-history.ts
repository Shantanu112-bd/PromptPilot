"use server";

import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { type ActionResponse } from "@/lib/types/action";

export async function getPromptHistoryAction(
  promptId: string
): Promise<ActionResponse<any[]>> {
  try {
    const session = await requireSession();
    
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    });

    if (!prompt || prompt.ownerId !== session.user.id) {
      return { ok: false, error: "Prompt not found or access denied." };
    }

    const history = await prisma.promptVersion.findMany({
      where: { promptId, deletedAt: null },
      orderBy: { version: "desc" },
      include: {
        author: { select: { id: true, name: true } }
      }
    });

    return { ok: true, data: history };
  } catch (error: unknown) {
    console.error("Failed to get prompt history:", error);
    return { ok: false, error: "Failed to load prompt history." };
  }
}
