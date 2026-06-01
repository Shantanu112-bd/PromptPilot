import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPromptAction, deletePromptAction, updatePromptAction } from './manage-prompt';
import { requireSession } from '@/features/auth/server/get-session';
import { prismaMock } from '@/lib/db/prisma-mock';
import { revalidatePath } from 'next/cache';

vi.mock('@/features/auth/server/get-session', () => ({
  requireSession: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('manage-prompt actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPromptAction', () => {
    it('should fail if user is not authenticated', async () => {
      (requireSession as any).mockRejectedValue(new Error('Unauthorized'));
      
      const result = await createPromptAction({ title: 'Test', content: 'Test content' });
      expect(result.ok).toBe(false);
      expect((result as any).error).toBe('Unauthorized');
    });

    it('should successfully create a prompt', async () => {
      (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      
      const mockPrompt = {
        id: 'prompt-1',
        title: 'Test Prompt',
        content: 'Test content',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      prismaMock.prompt.create.mockResolvedValue(mockPrompt as any);

      const result = await createPromptAction({
        title: 'Test Prompt',
        content: 'Test content'
      });

      expect(result.ok).toBe(true);
      expect((result as any).data.prompt.id).toBe('prompt-1');
      expect(prismaMock.prompt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ title: 'Test Prompt' })
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith('/library');
    });
  });

  describe('deletePromptAction', () => {
    it('should fail to delete prompt if unauthorized', async () => {
      (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      
      // Mock finding a prompt owned by someone else
      prismaMock.prompt.findUnique.mockResolvedValue({
        id: 'prompt-1',
        userId: 'user-2' // Different user!
      } as any);

      const result = await deletePromptAction({ id: 'prompt-1' });
      expect(result.ok).toBe(false);
      expect((result as any).error).toBe('Unauthorized');
      expect(prismaMock.prompt.delete).not.toHaveBeenCalled();
    });

    it('should delete own prompt', async () => {
      (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      
      prismaMock.prompt.findUnique.mockResolvedValue({
        id: 'prompt-1',
        userId: 'user-1' // Same user
      } as any);
      
      prismaMock.prompt.delete.mockResolvedValue({ id: 'prompt-1' } as any);

      const result = await deletePromptAction({ id: 'prompt-1' });
      expect(result.ok).toBe(true);
      expect(prismaMock.prompt.delete).toHaveBeenCalledWith({
        where: { id: 'prompt-1' }
      });
    });
  });
});
