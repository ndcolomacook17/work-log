import type { ArtifactsResponse } from '../api/types';
import { PRCard } from './PRCard';
import { ConfluenceCard } from './ConfluenceCard';
import { JiraCard } from './JiraCard';

interface ArtifactListProps {
  data: ArtifactsResponse | null;
  loading: boolean;
  error: string | null;
}

export function ArtifactList({ data, loading, error }: ArtifactListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading artifacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-12 text-gray-500">
        Select a week to view artifacts
      </div>
    );
  }

  const totalCount =
    data.pull_requests.length +
    data.confluence_docs.length +
    data.jira_tickets.length;

  if (totalCount === 0) {
    return (
      <div className="text-center p-12 text-gray-500">
        No artifacts found for this week
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-4 text-sm">
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {data.pull_requests.length} PRs
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {data.confluence_docs.length} Docs
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {data.jira_tickets.length} Tickets
        </span>
      </div>

      {data.pull_requests.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Pull Requests
          </h2>
          <div className="space-y-3">
            {data.pull_requests.map((pr, i) => (
              <PRCard key={i} pr={pr} />
            ))}
          </div>
        </section>
      )}

      {data.confluence_docs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Confluence Documents
          </h2>
          <div className="space-y-3">
            {data.confluence_docs.map((doc, i) => (
              <ConfluenceCard key={i} doc={doc} />
            ))}
          </div>
        </section>
      )}

      {data.jira_tickets.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Jira Tickets
          </h2>
          <div className="space-y-3">
            {data.jira_tickets.map((ticket, i) => (
              <JiraCard key={i} ticket={ticket} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
