import { useState, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { PRCard } from '../components/PRCard';
import { fetchArtifacts } from '../api/client';
import type { PullRequest } from '../api/types';

export function PullRequestsPage() {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPullRequests = async () => {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = subMonths(endDate, 6);

      try {
        const result = await fetchArtifacts(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );
        setPullRequests(result.pull_requests);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pull requests');
      } finally {
        setLoading(false);
      }
    };

    loadPullRequests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Pull Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-400">{error}</div>
      )}

      {!loading && !error && pullRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">No pull requests found</div>
      )}

      {!loading && !error && pullRequests.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            {pullRequests.length} pull request{pullRequests.length !== 1 ? 's' : ''}
          </div>
          {pullRequests.map((pr, index) => (
            <PRCard key={`${pr.url}-${index}`} pr={pr} />
          ))}
        </div>
      )}
    </div>
  );
}
