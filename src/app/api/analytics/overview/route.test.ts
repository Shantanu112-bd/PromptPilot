import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';
import { requireSession } from '@/features/auth/server/get-session';
import { prismaMock } from '@/lib/db/prisma-mock';

// Mock dependencies
vi.mock('@/features/auth/server/get-session', () => ({
  requireSession: vi.fn()
}));

describe('GET /api/analytics/overview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (requireSession as any).mockRejectedValue(new Error('Unauthorized'));

    const req = new NextRequest('http://localhost:3000/api/analytics/overview');
    const res = await GET(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: 'Unauthorized' });
  });

  it('should return 403 if normal user requests admin data', async () => {
    (requireSession as any).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' }
    });

    const req = new NextRequest('http://localhost:3000/api/analytics/overview?admin=true');
    const res = await GET(req);

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body).toEqual({ error: 'Unauthorized' });
  });

  it('should return user analytics data successfully', async () => {
    (requireSession as any).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' }
    });

    // Mock Prisma responses
    prismaMock.user.count.mockResolvedValue(10);
    prismaMock.generationHistory.groupBy.mockResolvedValue([
      { status: 'COMPLETED', _count: 90 },
      { status: 'FAILED', _count: 10 }
    ] as any);

    prismaMock.generationHistory.aggregate.mockResolvedValue({
      _avg: { latencyMs: 1500 },
      _sum: { inputTokens: 25000, outputTokens: 25000, costUsd: 0.5 }
    } as any);

    const req = new NextRequest('http://localhost:3000/api/analytics/overview');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body).toEqual({
      totalUsers: 10,
      activeUsers: 10,
      totalGenerations: 100,
      successRate: 90, // 90/100
      averageLatency: 1500,
      totalTokens: 50000,
      estimatedCost: 0.5
    });

    // Verify Prisma was called with correct user scope
    expect(prismaMock.generationHistory.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'user-1' })
      })
    );
  });
});
