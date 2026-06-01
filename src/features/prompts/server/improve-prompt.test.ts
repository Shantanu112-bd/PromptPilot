import { describe, it, expect, vi, beforeEach } from 'vitest';
import { improvePromptAction } from './improve-prompt';
import { requireSession } from '@/features/auth/server/get-session';
import { prismaMock } from '@/lib/db/prisma-mock';

vi.mock('@/features/auth/server/get-session', () => ({
  requireSession: vi.fn()
}));

vi.mock('better-auth', () => ({
  auth: { api: { getSession: vi.fn() } }
}));

vi.mock('@/features/prompts/providers/provider-switcher', () => ({
  generatePrompt: vi.fn()
}));

// Mock rate limiter
vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockReturnValue(true)
}));

describe('improvePromptAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if unauthenticated', async () => {
    (requireSession as any).mockRejectedValue(new Error('Unauthorized'));

    const result = await improvePromptAction({
      prompt: 'Hello'
    });

    expect(result.ok).toBe(false);
    expect((result as any).error).toBe('Failed to improve prompt.');
  });

  it('should validate originalPrompt correctly', async () => {
    (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });

    const result = await improvePromptAction({
      prompt: 'H' // too short
    });

    expect(result.ok).toBe(false);
    // Zod parsing will fail and fall into catch block
    expect((result as any).error).toBe('Failed to improve prompt.');
  });

  it('should successfully improve prompt for authorized user', async () => {
    (requireSession as any).mockResolvedValue({ user: { id: 'user-1' } });

    const { generatePrompt } = await import('@/features/prompts/providers/provider-switcher');
    (generatePrompt as any).mockResolvedValue({
      text: 'This is the improved prompt.'
    });

    const result = await improvePromptAction({
      prompt: 'This is a sufficiently long prompt to improve'
    });

    expect(result.ok).toBe(true);
    expect((result as any).data.improvedPrompt).toBe('This is the improved prompt.');
  });
});
