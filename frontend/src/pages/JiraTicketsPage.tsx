import { useState, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { JiraCard } from '../components/JiraCard';
import { fetchArtifacts } from '../api/client';
import type { JiraTicket } from '../api/types';

export function JiraTicketsPage() {
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = subMonths(endDate, 6);

      try {
        const result = await fetchArtifacts(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );
        setTickets(result.jira_tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Jira Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
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
