import type { ArtifactsResponse } from './types';

const API_BASE = 'http://localhost:8000';

export async function fetchArtifacts(
  startDate: string,
  endDate: string
): Promise<ArtifactsResponse> {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  const response = await fetch(`${API_BASE}/api/artifacts?${params}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
