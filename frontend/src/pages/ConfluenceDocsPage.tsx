import { useState, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { ConfluenceCard } from '../components/ConfluenceCard';
import { fetchArtifacts } from '../api/client';
import type { ConfluenceDoc } from '../api/types';

export function ConfluenceDocsPage() {
  const [docs, setDocs] = useState<ConfluenceDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = subMonths(endDate, 6);

      try {
        const result = await fetchArtifacts(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Confluence Documents</h1>
        <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
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
