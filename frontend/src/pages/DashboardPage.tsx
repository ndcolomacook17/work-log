import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { PillButton } from '../components/PillButton';
import { ArtifactList } from '../components/ArtifactList';
import { fetchArtifacts } from '../api/client';
import type { ArtifactsResponse } from '../api/types';

interface MonthInfo {
  label: string;
  year: number;
  month: number;
  startDate: Date;
  endDate: Date;
}

function getLastSixMonths(): MonthInfo[] {
  const months: MonthInfo[] = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const date = subMonths(today, i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    months.push({
      label: format(date, 'MMM yyyy'),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      startDate: start,
      endDate: end,
    });
  }

  return months;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sources = searchParams.get('sources')?.split(',') || [];

  const [data, setData] = useState<ArtifactsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const months = getLastSixMonths();

  useEffect(() => {
    if (sources.length === 0) {
      navigate('/');
      return;
    }

    const loadArtifacts = async () => {
      setLoading(true);
      setError(null);

      const sixMonthsAgo = subMonths(new Date(), 6);
      const startDate = format(startOfMonth(sixMonthsAgo), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');

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
  }, [sources.join(','), navigate]);

  const handleMonthClick = (month: MonthInfo) => {
    const sourcesParam = sources.join(',');
    navigate(`/month/${month.year}/${month.month}?sources=${sourcesParam}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          Work Output Dashboard
        </h1>
        <p className="text-gray-400">
          Last 6 months of your work across {sources.length} integration{sources.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
          Browse by Month
        </h2>
        <div className="flex flex-wrap gap-2">
          {months.map((month) => (
            <PillButton
              key={`${month.year}-${month.month}`}
              label={month.label}
              onClick={() => handleMonthClick(month)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">
          All Artifacts (Last 6 Months)
        </h2>
        <ArtifactList data={data} loading={loading} error={error} />
      </div>
    </div>
  );
}
