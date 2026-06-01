"use server";

import { z } from "zod";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { type ActionResponse } from "@/lib/types/action";

const createCollectionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional()
});

export async function createCollectionAction(
  formData: z.infer<typeof createCollectionSchema>
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await requireSession();
    const validated = createCollectionSchema.parse(formData);

    const collection = await prisma.promptCollection.create({
      data: {
        name: validated.name,
        description: validated.description,
        ownerId: session.user.id
      }
    });

    return { ok: true, data: { id: collection.id } };
  } catch (error: unknown) {
    console.error("Failed to create collection:", error);
    return { ok: false, error: "Failed to create collection." };
  }
}

const addPromptSchema = z.object({
  promptId: z.string().uuid(),
  collectionId: z.string().uuid()
});

export async function addPromptToCollectionAction(
  promptId: string,
  collectionId: string
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const session = await requireSession();
    const validated = addPromptSchema.parse({ promptId, collectionId });

    // Verify ownership
    const collection = await prisma.promptCollection.findUnique({
      where: { id: validated.collectionId }
    });

    if (!collection || collection.ownerId !== session.user.id) {
      return { ok: false, error: "Collection not found or access denied." };
    }

    // Connect
    await prisma.promptCollection.update({
      where: { id: validated.collectionId },
      data: {
        prompts: {
          connect: { id: validated.promptId }
        }
      }
    });

    return { ok: true, data: { success: true } };
  } catch (error: unknown) {
    console.error("Failed to add prompt to collection:", error);
    return { ok: false, error: "Failed to add prompt to collection." };
  }
}

const removePromptSchema = z.object({
  promptId: z.string().uuid(),
  collectionId: z.string().uuid()
});

export async function removePromptFromCollectionAction(
  promptId: string,
  collectionId: string
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const session = await requireSession();
    const validated = removePromptSchema.parse({ promptId, collectionId });

    // Verify ownership
    const collection = await prisma.promptCollection.findUnique({
      where: { id: validated.collectionId }
    });

    if (!collection || collection.ownerId !== session.user.id) {
      return { ok: false, error: "Collection not found or access denied." };
    }

    // Disconnect
    await prisma.promptCollection.update({
      where: { id: validated.collectionId },
      data: {
        prompts: {
          disconnect: { id: validated.promptId }
        }
      }
    });

    return { ok: true, data: { success: true } };
  } catch (error: unknown) {
    console.error("Failed to remove prompt from collection:", error);
    return { ok: false, error: "Failed to remove prompt from collection." };
  }
}

export async function deleteCollectionAction(
  collectionId: string
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const session = await requireSession();
    
    // Verify ownership
    const collection = await prisma.promptCollection.findUnique({
      where: { id: collectionId }
    });

    if (!collection || collection.ownerId !== session.user.id) {
      return { ok: false, error: "Collection not found or access denied." };
    }

    // Soft delete if requested, but typically users want hard delete for folders. We'll do soft delete to match schema.
    await prisma.promptCollection.update({
      where: { id: collectionId },
      data: { deletedAt: new Date() }
    });

    return { ok: true, data: { success: true } };
  } catch (error: unknown) {
    console.error("Failed to delete collection:", error);
    return { ok: false, error: "Failed to delete collection." };
  }
}
