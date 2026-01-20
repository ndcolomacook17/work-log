import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { PRCard } from '../components/PRCard';
import { fetchArtifacts } from '../api/client';
import type { PullRequest } from '../api/types';

export function PullRequestsWeekPage() {
  const { startDate, endDate } = useParams<{ startDate: string; endDate: string }>();
  const navigate = useNavigate();

  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) {
      navigate('/pull-requests');
      return;
    }

    const loadPullRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchArtifacts(startDate, endDate, ['github']);
        setPullRequests(result.pull_requests);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pull requests');
      } finally {
        setLoading(false);
      }
    };

    loadPullRequests();
  }, [startDate, endDate, navigate]);

  const handleBackToMonth = () => {
    if (startDate) {
      const date = parseISO(startDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      navigate(`/pull-requests/month/${year}/${month}`);
    }
  };

  if (!startDate || !endDate) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Invalid date range</p>
          <button
            onClick={() => navigate('/pull-requests')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Go back to Pull Requests
          </button>
        </div>
      </div>
    );
  }

  const formattedStart = format(parseISO(startDate), 'MMM d, yyyy');
  const formattedEnd = format(parseISO(endDate), 'MMM d, yyyy');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBackToMonth}
            className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1 transition-colors"
          >
            <span>&larr;</span> Back to month
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => navigate('/pull-requests')}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            All Pull Requests
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-100">
          Pull Requests
        </h1>
        <p className="text-gray-400 mt-1">
          {formattedStart} to {formattedEnd}
        </p>
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
