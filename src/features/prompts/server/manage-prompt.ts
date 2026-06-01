"use server";

import { z } from "zod";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { type ActionResponse } from "@/lib/types/action";

const editMetadataSchema = z.object({
  promptId: z.string().uuid(),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  toolId: z.string().uuid().optional().nullable(),
  modelId: z.string().uuid().optional().nullable()
});

export async function editPromptMetadataAction(
  input: z.infer<typeof editMetadataSchema>
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const session = await requireSession();
    const validated = editMetadataSchema.parse(input);

    const prompt = await prisma.prompt.findUnique({
      where: { id: validated.promptId }
    });

    if (!prompt || prompt.ownerId !== session.user.id) {
      return { ok: false, error: "Prompt not found or access denied." };
    }

    await prisma.prompt.update({
      where: { id: validated.promptId },
      data: {
        ...(validated.title !== undefined && { title: validated.title }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.tags !== undefined && { tags: validated.tags }),
        ...(validated.categoryId !== undefined && { categoryId: validated.categoryId }),
        ...(validated.toolId !== undefined && { toolId: validated.toolId }),
        ...(validated.modelId !== undefined && { modelId: validated.modelId }),
      }
    });

    return { ok: true, data: { success: true } };
  } catch (error: unknown) {
    console.error("Failed to edit prompt metadata:", error);
    return { ok: false, error: "Failed to edit prompt metadata." };
  }
}

export async function duplicatePromptAction(
  promptId: string
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await requireSession();
    
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    });

    // Assume user can duplicate any public prompt or their own
    if (!prompt) {
      return { ok: false, error: "Prompt not found." };
    }
    
    if (prompt.ownerId !== session.user.id && prompt.visibility === "PRIVATE") {
       return { ok: false, error: "Cannot duplicate a private prompt." };
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        title: `${prompt.title} (Copy)`,
        content: prompt.content,
        systemPrompt: prompt.systemPrompt,
        description: prompt.description,
        visibility: "PRIVATE",
        ownerId: session.user.id,
        tags: prompt.tags,
        categoryId: prompt.categoryId,
        toolId: prompt.toolId,
        modelId: prompt.modelId,
        aiProviderId: prompt.aiProviderId,
        metadata: prompt.metadata ? JSON.parse(JSON.stringify(prompt.metadata)) : undefined
      }
    });

    return { ok: true, data: { id: newPrompt.id } };
  } catch (error: unknown) {
    console.error("Failed to duplicate prompt:", error);
    return { ok: false, error: "Failed to duplicate prompt." };
  }
}

export async function deletePromptAction(
  promptId: string
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const session = await requireSession();
    
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    });

    if (!prompt || prompt.ownerId !== session.user.id) {
      return { ok: false, error: "Prompt not found or access denied." };
    }

    // Soft delete
    await prisma.prompt.update({
      where: { id: promptId },
      data: { deletedAt: new Date() }
    });

    return { ok: true, data: { success: true } };
  } catch (error: unknown) {
    console.error("Failed to delete prompt:", error);
    return { ok: false, error: "Failed to delete prompt." };
  }
}
