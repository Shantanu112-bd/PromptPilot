"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/features/auth/server/get-session";

export type ActionResponse<T> = 
  | { ok: true; data: T }
  | { ok: false; error: string };

async function verifyAdmin() {
  const session = await requireSession();
  if ((session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getUsersAction(page = 1, limit = 50): Promise<ActionResponse<any>> {
  try {
    await verifyAdmin();
    
    const users = await prisma.user.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        deletedAt: true,
        _count: {
          select: { generationHistory: true }
        }
      }
    });

    const total = await prisma.user.count();

    return { ok: true, data: { users, total, page, limit } };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to fetch users" };
  }
}

export async function updateUserRoleAction(userId: string, role: "USER" | "ADMIN"): Promise<ActionResponse<boolean>> {
  try {
    await verifyAdmin();
    
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    revalidatePath("/admin/users");
    return { ok: true, data: true };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update role" };
  }
}

export async function toggleUserStatusAction(userId: string, isDeleted: boolean): Promise<ActionResponse<boolean>> {
  try {
    await verifyAdmin();
    
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: isDeleted ? new Date() : null }
    });

    revalidatePath("/admin/users");
    return { ok: true, data: true };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to toggle status" };
  }
}
