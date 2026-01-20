import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subMonths, startOfMonth } from 'date-fns';
import { ConfluenceCard } from '../components/ConfluenceCard';
import { PillButton } from '../components/PillButton';
import { fetchArtifacts } from '../api/client';
import type { ConfluenceDoc } from '../api/types';

interface MonthInfo {
  label: string;
  year: number;
  month: number;
}

function getLastSixMonths(): MonthInfo[] {
  const months: MonthInfo[] = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const date = subMonths(today, i);
    months.push({
      label: format(date, 'MMM yyyy'),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }

  return months;
}

export function ConfluenceDocsPage() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<ConfluenceDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const months = getLastSixMonths();

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = subMonths(endDate, 6);

      try {
        const result = await fetchArtifacts(
          format(startOfMonth(startDate), 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          ['confluence']
        );
        setDocs(result.confluence_docs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, []);

  const handleMonthClick = (month: MonthInfo) => {
    navigate(`/confluence/month/${month.year}/${month.month}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Confluence Documents</h1>
        <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
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

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-400">{error}</div>
      )}

      {!loading && !error && docs.length === 0 && (
        <div className="text-center py-8 text-gray-500">No documents found</div>
      )}

      {!loading && !error && docs.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            {docs.length} document{docs.length !== 1 ? 's' : ''}
          </div>
          {docs.map((doc, index) => (
            <ConfluenceCard key={`${doc.url}-${index}`} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
