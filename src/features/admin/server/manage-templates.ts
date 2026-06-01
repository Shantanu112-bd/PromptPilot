"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/features/auth/server/get-session";

export type ActionResponse<T> = 
  | { ok: true; data: T }
  | { ok: false; error: string };

async function verifyAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function getTemplatesAction(page = 1, limit = 50): Promise<ActionResponse<any>> {
  try {
    await verifyAdmin();
    
    const templates = await prisma.promptTemplate.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { generationHistory: true } }
      }
    });

    const total = await prisma.promptTemplate.count({ where: { deletedAt: null } });

    return { ok: true, data: { templates, total, page, limit } };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to fetch templates" };
  }
}

export async function toggleTemplateStatusAction(id: string, newStatus: "PUBLISHED" | "ARCHIVED"): Promise<ActionResponse<boolean>> {
  try {
    await verifyAdmin();
    
    await prisma.promptTemplate.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/admin/templates");
    return { ok: true, data: true };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}

export async function deleteTemplateAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    await verifyAdmin();
    
    await prisma.promptTemplate.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    revalidatePath("/admin/templates");
    return { ok: true, data: true };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to delete template" };
  }
}
