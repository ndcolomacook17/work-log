import type { ArtifactsResponse, SummaryResponse } from './types';

const API_BASE = 'http://localhost:8000';

export async function fetchArtifacts(
  startDate: string,
  endDate: string,
  sources?: string[]
): Promise<ArtifactsResponse> {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  if (sources && sources.length > 0) {
    params.set('sources', sources.join(','));
  }

  const response = await fetch(`${API_BASE}/api/artifacts?${params}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function summarizeArtifacts(
  data: ArtifactsResponse
): Promise<SummaryResponse> {
  const response = await fetch(`${API_BASE}/api/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
