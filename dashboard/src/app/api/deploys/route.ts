import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';

const CLIENT_REPOS = [
  { org: 'glvcrypto', repo: 'reyco-marine', label: 'Reyco Marine' },
  { org: 'glvcrypto', repo: 'titantinyhomes', label: 'Titan Tiny Homes' },
  { org: 'glvcrypto', repo: 'fusionfinancial', label: 'Fusion Financial' },
  { org: 'glvcrypto', repo: 'glvmarketing', label: 'GLV Marketing' },
];

async function fetchRuns(org: string, repo: string, limit: number) {
  const url = `https://api.github.com/repos/${org}/${repo}/actions/runs?per_page=${limit}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.workflow_runs ?? []) as GHRun[];
}

interface GHRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  head_branch: string;
  head_sha: string;
  head_commit?: { message?: string };
  event: string;
  run_number: number;
}

function durationSec(run: GHRun): number | null {
  if (!run.updated_at || run.status === 'in_progress' || run.status === 'queued') return null;
  return Math.round((new Date(run.updated_at).getTime() - new Date(run.created_at).getTime()) / 1000);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '5', 10) || 5, 20);

  if (!GITHUB_TOKEN) {
    return Response.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });
  }

  try {
    const results = await Promise.all(
      CLIENT_REPOS.map(async ({ org, repo, label }) => {
        const runs = await fetchRuns(org, repo, limit);
        return {
          repo,
          label,
          runs: runs.slice(0, limit).map((r) => ({
            id: r.id,
            run_number: r.run_number,
            name: r.name,
            status: r.status,
            conclusion: r.conclusion,
            branch: r.head_branch,
            sha: r.head_sha.slice(0, 7),
            commit_message: r.head_commit?.message?.split('\n')[0] ?? '',
            event: r.event,
            created_at: r.created_at,
            updated_at: r.updated_at,
            duration_sec: durationSec(r),
            url: r.html_url,
          })),
        };
      })
    );
    return Response.json(results);
  } catch (err) {
    console.error('[api/deploys]', err);
    return Response.json({ error: 'Failed to fetch deploy data' }, { status: 500 });
  }
}
