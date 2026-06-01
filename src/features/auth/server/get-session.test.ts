import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSession, requireSession } from './get-session';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

// Mock dependencies
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map()),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Auth Session Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSession', () => {
    it('should return session when available', async () => {
      const mockSession = { user: { id: '1' } };
      (auth.api.getSession as any).mockResolvedValue(mockSession);

      const session = await getSession();
      expect(session).toEqual(mockSession);
    });

    it('should return null when no session is available', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);

      const session = await getSession();
      expect(session).toBeNull();
    });
  });

  describe('requireSession', () => {
    it('should return session if available', async () => {
      const mockSession = { user: { id: '1' } };
      (auth.api.getSession as any).mockResolvedValue(mockSession);

      const session = await requireSession();
      expect(session).toEqual(mockSession);
      expect(redirect).not.toHaveBeenCalled();
    });

    it('should call redirect to /sign-in if no session', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);

      await requireSession();
      expect(redirect).toHaveBeenCalledWith('/sign-in');
    });
  });
});
