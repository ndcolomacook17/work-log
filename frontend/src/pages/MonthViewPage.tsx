import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isBefore,
  isAfter,
} from 'date-fns';
import { PillButton } from '../components/PillButton';
import { ArtifactList } from '../components/ArtifactList';
import { fetchArtifacts } from '../api/client';
import type { ArtifactsResponse } from '../api/types';

interface WeekInfo {
  label: string;
  startDate: Date;
  endDate: Date;
}

function getWeeksInMonth(year: number, month: number): WeekInfo[] {
  const weeks: WeekInfo[] = [];
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);

  let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  let weekNumber = 1;

  while (isBefore(weekStart, monthEnd) || weekStart.getTime() === monthEnd.getTime()) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    const effectiveStart = isAfter(weekStart, monthStart) ? weekStart : monthStart;
    const effectiveEnd = isBefore(weekEnd, monthEnd) ? weekEnd : monthEnd;

    weeks.push({
      label: `Week ${weekNumber}`,
      startDate: effectiveStart,
      endDate: effectiveEnd,
    });

    weekStart = addWeeks(weekStart, 1);
    weekNumber++;

    if (isAfter(weekStart, monthEnd)) break;
  }

  return weeks;
}

export function MonthViewPage() {
  const { year, month } = useParams<{ year: string; month: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sources = searchParams.get('sources')?.split(',') || [];

  const [data, setData] = useState<ArtifactsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearNum = parseInt(year || '0', 10);
  const monthNum = parseInt(month || '0', 10);

  const monthDate = new Date(yearNum, monthNum - 1);
  const monthLabel = format(monthDate, 'MMMM yyyy');

  const weeks = getWeeksInMonth(yearNum, monthNum);

  useEffect(() => {
    if (!year || !month || sources.length === 0) {
      navigate('/');
      return;
    }

    const loadArtifacts = async () => {
      setLoading(true);
      setError(null);

      const monthStart = startOfMonth(new Date(yearNum, monthNum - 1));
      const monthEnd = endOfMonth(monthStart);

      try {
        const result = await fetchArtifacts(
          format(monthStart, 'yyyy-MM-dd'),
          format(monthEnd, 'yyyy-MM-dd'),
          sources
        );
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artifacts');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadArtifacts();
  }, [year, month, sources.join(','), navigate]);

  const handleWeekClick = (week: WeekInfo) => {
    const startDate = format(week.startDate, 'yyyy-MM-dd');
    const endDate = format(week.endDate, 'yyyy-MM-dd');
    const sourcesParam = sources.join(',');
    navigate(`/week/${startDate}/${endDate}?sources=${sourcesParam}`);
  };

  const handleBackToDashboard = () => {
    const sourcesParam = sources.join(',');
    navigate(`/dashboard?sources=${sourcesParam}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={handleBackToDashboard}
          className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center gap-1 transition-colors"
        >
          <span>&larr;</span> Back to dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-100">
          {monthLabel}
        </h1>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
          Browse by Week
        </h2>
        <div className="flex flex-wrap gap-2">
          {weeks.map((week, index) => (
            <PillButton
              key={index}
              label={`${week.label} (${format(week.startDate, 'MMM d')} - ${format(week.endDate, 'd')})`}
              onClick={() => handleWeekClick(week)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">
          All Artifacts in {monthLabel}
        </h2>
        <ArtifactList data={data} loading={loading} error={error} />
      </div>
    </div>
  );
}
