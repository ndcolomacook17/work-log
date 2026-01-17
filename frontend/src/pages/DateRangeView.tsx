import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ArtifactList } from '../components/ArtifactList';
import { fetchArtifacts } from '../api/client';
import type { ArtifactsResponse } from '../api/types';

export function DateRangeView() {
  const { startDate, endDate } = useParams<{ startDate: string; endDate: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ArtifactsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const loadArtifacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchArtifacts(startDate, endDate);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artifacts');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadArtifacts();
  }, [startDate, endDate]);

  if (!startDate || !endDate) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Invalid date range</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Go back to dashboard
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
        <button
          onClick={() => navigate('/')}
          className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center gap-1 transition-colors"
        >
          <span>&larr;</span> Back to dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-100">
          Work Output
        </h1>
        <p className="text-gray-400 mt-1">
          {formattedStart} to {formattedEnd}
        </p>
      </div>

      <ArtifactList data={data} loading={loading} error={error} />
    </div>
  );
}
