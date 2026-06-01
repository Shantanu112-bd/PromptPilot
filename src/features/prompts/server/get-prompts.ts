"use server";

import { z } from "zod";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { type ActionResponse } from "@/lib/types/action";

const getPromptsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  toolId: z.string().optional(),
  modelId: z.string().optional(),
  collectionId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "usage"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  favoritesOnly: z.boolean().default(false)
});

export type GetPromptsInput = z.infer<typeof getPromptsSchema>;

export async function getPromptsAction(input: GetPromptsInput): Promise<ActionResponse<any>> {
  try {
    const session = await requireSession();
    const validated = getPromptsSchema.parse(input);

    const skip = (validated.page - 1) * validated.limit;

    // Build the where clause
    const where: any = {
      ownerId: session.user.id,
      deletedAt: null
    };

    if (validated.query) {
      where.OR = [
        { title: { contains: validated.query, mode: "insensitive" } },
        { description: { contains: validated.query, mode: "insensitive" } },
        { content: { contains: validated.query, mode: "insensitive" } }
      ];
    }

    if (validated.categoryId) where.categoryId = validated.categoryId;
    if (validated.toolId) where.toolId = validated.toolId;
    if (validated.modelId) where.modelId = validated.modelId;
    
    if (validated.tags && validated.tags.length > 0) {
      where.tags = { hasSome: validated.tags };
    }

    if (validated.collectionId) {
      where.collections = {
        some: { id: validated.collectionId }
      };
    }

    if (validated.favoritesOnly) {
      where.savedBy = {
        some: { userId: session.user.id, isFavorite: true }
      };
    }

    // Determine ordering
    let orderBy: any = { [validated.sortBy === "usage" ? "createdAt" : validated.sortBy]: validated.sortOrder };
    
    if (validated.sortBy === "usage") {
      // In a real app we might sort by usageAnalytics relation count, 
      // but Prisma makes sorting by relation counts slightly tricky if not simple.
      // We will sort by _count of usageAnalytics
      orderBy = {
        usageAnalytics: {
          _count: validated.sortOrder
        }
      };
    }

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        orderBy,
        skip,
        take: validated.limit,
        include: {
          category: { select: { id: true, name: true } },
          tool: { select: { id: true, name: true, iconUrl: true } },
          model: { select: { id: true, name: true, displayName: true } },
          savedBy: {
            where: { userId: session.user.id },
            select: { isFavorite: true }
          },
          _count: {
            select: { usageAnalytics: true, versions: true }
          }
        }
      }),
      prisma.prompt.count({ where })
    ]);

    // Format the response
    const formattedPrompts = prompts.map(prompt => ({
      ...prompt,
      isFavorite: prompt.savedBy.length > 0 ? prompt.savedBy[0].isFavorite : false,
      usageCount: prompt._count.usageAnalytics,
      versionCount: prompt._count.versions,
      savedBy: undefined, // Remove raw relation data
      _count: undefined // Remove raw relation data
    }));

    return {
      ok: true,
      data: {
        prompts: formattedPrompts,
        pagination: {
          total,
          page: validated.page,
          limit: validated.limit,
          totalPages: Math.ceil(total / validated.limit)
        }
      }
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get prompts:", message);
    return { ok: false, error: "Failed to load prompts." };
  }
}
