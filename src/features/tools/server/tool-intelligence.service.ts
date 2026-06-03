import { prisma } from "@/lib/db/prisma";
import { type ToolIntelligence, type Tool } from "@prisma/client";

export type ToolWithIntelligence = Tool & {
  intelligence: ToolIntelligence | null;
};

/**
 * Retrieves the Tool Intelligence profile for a specific tool.
 * @param slug - The slug identifier for the tool (e.g., "cursor", "claude-code").
 */
export async function getToolIntelligenceBySlug(slug: string): Promise<ToolWithIntelligence | null> {
  const tool = await prisma.tool.findUnique({
    where: { slug, deletedAt: null },
    include: {
      intelligence: true,
    },
  });

  return tool;
}

/**
 * Retrieves all tools along with their associated intelligence profiles.
 */
export async function getAllToolIntelligence(): Promise<ToolWithIntelligence[]> {
  const tools = await prisma.tool.findMany({
    where: { deletedAt: null },
    include: {
      intelligence: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return tools;
}

/**
 * Updates or creates a tool intelligence profile.
 */
export async function upsertToolIntelligence(
  toolId: string,
  data: Omit<ToolIntelligence, "id" | "toolId" | "createdAt" | "updatedAt">
): Promise<ToolIntelligence> {
  return await prisma.toolIntelligence.upsert({
    where: { toolId },
    update: {
      promptStyle: data.promptStyle,
      contextWindow: data.contextWindow,
      bestPractices: data.bestPractices,
      outputStructure: data.outputStructure,
      recommendedTechniques: data.recommendedTechniques,
    },
    create: {
      toolId,
      promptStyle: data.promptStyle,
      contextWindow: data.contextWindow,
      bestPractices: data.bestPractices,
      outputStructure: data.outputStructure,
      recommendedTechniques: data.recommendedTechniques,
    },
  });
}
