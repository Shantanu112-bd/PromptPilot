import { ProfileCard } from "@/features/profile/components/profile-card";
import { SessionCard } from "@/features/profile/components/session-card";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";

export default async function ProfilePage() {
  const session = await requireSession();
  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true
    }
  });

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">View your authenticated account and session details.</p>
      </div>
      <ProfileCard user={user} />
      <SessionCard session={session} />
    </div>
  );
}
