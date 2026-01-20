import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ArtifactList } from '../components/ArtifactList';
import { fetchArtifacts } from '../api/client';
import type { ArtifactsResponse } from '../api/types';

export function WeekViewPage() {
  const { startDate, endDate } = useParams<{ startDate: string; endDate: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sources = searchParams.get('sources')?.split(',') || [];

  const [data, setData] = useState<ArtifactsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate || sources.length === 0) {
      navigate('/');
      return;
    }

    const loadArtifacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchArtifacts(startDate, endDate, sources);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artifacts');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadArtifacts();
  }, [startDate, endDate, sources.join(','), navigate]);

  const handleBackToMonth = () => {
    if (startDate) {
      const date = parseISO(startDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const sourcesParam = sources.join(',');
      navigate(`/month/${year}/${month}?sources=${sourcesParam}`);
    }
  };

  const handleBackToDashboard = () => {
    const sourcesParam = sources.join(',');
    navigate(`/dashboard?sources=${sourcesParam}`);
  };

  if (!startDate || !endDate) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Invalid date range</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const formattedStart = format(parseISO(startDate), 'MMM d, yyyy');
  const formattedEnd = format(parseISO(endDate), 'MMM d, yyyy');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
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
            onClick={handleBackToDashboard}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Dashboard
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-100">
          Week View
        </h1>
        <p className="text-gray-400 mt-1">
          {formattedStart} to {formattedEnd}
        </p>
      </div>

      <ArtifactList data={data} loading={loading} error={error} />
    </div>
  );
}
