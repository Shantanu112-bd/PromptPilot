import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCollectionAction, deleteCollectionAction } from './manage-collections';
import { requireSession } from '@/features/auth/server/get-session';
import { prismaMock } from '@/lib/db/prisma-mock';
import { revalidatePath } from 'next/cache';

vi.mock('@/features/auth/server/get-session', () => ({
  requireSession: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('manage-collections actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCollectionAction', () => {
    it('should fail if user is not authenticated', async () => {
      (requireSession as any).mockRejectedValue(new Error('Unauthorized'));
      
      const result = await createCollectionAction({ name: 'My Collection' });
      expect(result.ok).toBe(false);
      expect((result as any).error).toBe('Unauthorized');
    });

    it('should successfully create a collection', async () => {
      (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      
      prismaMock.collection.create.mockResolvedValue({
        id: 'collection-1',
        name: 'My Collection',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await createCollectionAction({ name: 'My Collection' });

      expect(result.ok).toBe(true);
      expect((result as any).data.collection.id).toBe('collection-1');
      expect(prismaMock.collection.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: 'My Collection',
            userId: 'user-1'
          }
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith('/library');
    });
  });

  describe('deleteCollectionAction', () => {
    it('should block unauthorized deletion', async () => {
      (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      
      prismaMock.collection.findUnique.mockResolvedValue({
        id: 'collection-1',
        userId: 'user-2' // malicious attempt
      } as any);

      const result = await deleteCollectionAction({ id: 'collection-1' });
      expect(result.ok).toBe(false);
      expect((result as any).error).toBe('Unauthorized');
    });

    it('should delete collection', async () => {
      (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      
      prismaMock.collection.findUnique.mockResolvedValue({
        id: 'collection-1',
        userId: 'user-1'
      } as any);

      prismaMock.collection.delete.mockResolvedValue({ id: 'collection-1' } as any);

      const result = await deleteCollectionAction({ id: 'collection-1' });
      expect(result.ok).toBe(true);
      expect(prismaMock.collection.delete).toHaveBeenCalledWith({
        where: { id: 'collection-1' }
      });
      expect(revalidatePath).toHaveBeenCalledWith('/library');
    });
  });
});
