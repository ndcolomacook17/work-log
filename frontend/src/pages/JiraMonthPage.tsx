import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { JiraCard } from '../components/JiraCard';
import { PillButton } from '../components/PillButton';
import { fetchArtifacts } from '../api/client';
import type { JiraTicket } from '../api/types';

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

export function JiraMonthPage() {
  const { year, month } = useParams<{ year: string; month: string }>();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearNum = parseInt(year || '0', 10);
  const monthNum = parseInt(month || '0', 10);

  const monthDate = new Date(yearNum, monthNum - 1);
  const monthLabel = format(monthDate, 'MMMM yyyy');

  const weeks = getWeeksInMonth(yearNum, monthNum);

  useEffect(() => {
    if (!year || !month) {
      navigate('/jira');
      return;
    }

    const loadTickets = async () => {
      setLoading(true);
      setError(null);

      const monthStart = startOfMonth(new Date(yearNum, monthNum - 1));
      const monthEnd = endOfMonth(monthStart);

      try {
        const result = await fetchArtifacts(
          format(monthStart, 'yyyy-MM-dd'),
          format(monthEnd, 'yyyy-MM-dd'),
          ['jira']
        );
        setTickets(result.jira_tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [year, month, navigate]);

  const handleWeekClick = (week: WeekInfo) => {
    const startDate = format(week.startDate, 'yyyy-MM-dd');
    const endDate = format(week.endDate, 'yyyy-MM-dd');
    navigate(`/jira/week/${startDate}/${endDate}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/jira')}
          className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center gap-1 transition-colors"
        >
          <span>&larr;</span> Back to Jira
        </button>

        <h1 className="text-2xl font-bold text-gray-100">
          Jira Tickets - {monthLabel}
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

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-400">{error}</div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">No tickets found</div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </div>
          {tickets.map((ticket, index) => (
            <JiraCard key={`${ticket.key}-${index}`} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
