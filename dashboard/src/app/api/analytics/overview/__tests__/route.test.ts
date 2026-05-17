import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/data/analytics', () => ({
  getTaskThroughput: vi.fn(),
  getAgentEffectiveness: vi.fn(),
}));
vi.mock('@/lib/cost-parser', () => ({
  getDailyCosts: vi.fn(),
  getDailyCostByModel: vi.fn(),
  getCurrentMonthCost: vi.fn(),
  getCostByModel: vi.fn(),
}));
vi.mock('@/lib/data/reports', () => ({
  getFleetHealth: vi.fn(),
}));
vi.mock('@/lib/config', () => ({
  getAllAgents: vi.fn(),
}));

import { GET } from '../route';
import { getTaskThroughput, getAgentEffectiveness } from '@/lib/data/analytics';
import { getDailyCosts, getDailyCostByModel, getCurrentMonthCost, getCostByModel } from '@/lib/cost-parser';
import { getFleetHealth } from '@/lib/data/reports';
import { getAllAgents } from '@/lib/config';

function makeReq(params?: Record<string, string>) {
  const url = new URL('http://localhost/api/analytics/overview');
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString());
}

const mockHealth = { status: 'healthy', agents: 3 };
const mockThroughput = [{ date: '2026-04-30', completed: 2 }];
const mockEffectiveness = [{ agent: 'dev', completion_rate: 0.9 }];
const mockDaily = [{ date: '2026-04-30', cost: 0.12 }];
const mockDailyByModel = [{ date: '2026-04-30', model: 'sonnet', cost: 0.12 }];
const mockMonthCost = 3.5;
const mockCostByModel = [{ model: 'sonnet', cost: 3.5 }];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAllAgents).mockReturnValue([
    { name: 'dev', org: 'glv', dir: '/tmp/dev' },
    { name: 'seo', org: 'reyco', dir: '/tmp/seo' },
  ] as ReturnType<typeof getAllAgents>);
  vi.mocked(getFleetHealth).mockReturnValue(mockHealth as ReturnType<typeof getFleetHealth>);
  vi.mocked(getTaskThroughput).mockReturnValue(mockThroughput as ReturnType<typeof getTaskThroughput>);
  vi.mocked(getAgentEffectiveness).mockReturnValue(mockEffectiveness as ReturnType<typeof getAgentEffectiveness>);
  vi.mocked(getDailyCosts).mockReturnValue(mockDaily as ReturnType<typeof getDailyCosts>);
  vi.mocked(getDailyCostByModel).mockReturnValue(mockDailyByModel as ReturnType<typeof getDailyCostByModel>);
  vi.mocked(getCurrentMonthCost).mockReturnValue(mockMonthCost);
  vi.mocked(getCostByModel).mockReturnValue(mockCostByModel as ReturnType<typeof getCostByModel>);
});

describe('GET /api/analytics/overview', () => {
  it('returns full analytics shape', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('fleetHealth');
    expect(body).toHaveProperty('throughput');
    expect(body).toHaveProperty('effectiveness');
    expect(body).toHaveProperty('costs');
    expect(body.costs).toHaveProperty('daily');
    expect(body.costs).toHaveProperty('byModel');
    expect(body.costs).toHaveProperty('currentMonth');
    expect(body.costs).toHaveProperty('modelBreakdown');
  });

  it('passes days param to throughput and cost functions', async () => {
    await GET(makeReq({ days: '7' }));
    expect(getTaskThroughput).toHaveBeenCalledWith(7, undefined);
    expect(getDailyCosts).toHaveBeenCalledWith(7);
    expect(getDailyCostByModel).toHaveBeenCalledWith(7);
  });

  it('passes org filter to analytics functions', async () => {
    await GET(makeReq({ org: 'glv', days: '30' }));
    expect(getTaskThroughput).toHaveBeenCalledWith(30, 'glv');
    expect(getAgentEffectiveness).toHaveBeenCalledWith('glv');
  });

  it('uses fleet health from first org that returns data', async () => {
    // getAllAgents returns [{org:'glv'}, {org:'reyco'}], so orgs=['glv','reyco']
    // First call (glv) returns null → no break; second call (reyco) returns mockHealth → break
    vi.mocked(getFleetHealth)
      .mockReturnValueOnce(null as ReturnType<typeof getFleetHealth>)
      .mockReturnValueOnce(mockHealth as ReturnType<typeof getFleetHealth>);
    const res = await GET(makeReq());
    const body = await res.json();
    expect(body.fleetHealth).toEqual(mockHealth);
  });

  it('returns fleetHealth null when all orgs fail', async () => {
    vi.mocked(getFleetHealth).mockImplementation(() => { throw new Error('fail'); });
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.fleetHealth).toBeNull();
  });

  it('returns 500 when a core function throws', async () => {
    vi.mocked(getTaskThroughput).mockImplementation(() => { throw new Error('db error'); });
    const res = await GET(makeReq());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Failed to load analytics');
  });
});
