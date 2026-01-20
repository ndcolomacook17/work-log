import { useState } from 'react';
import type { ArtifactsResponse } from '../api/types';
import { summarizeArtifacts } from '../api/client';
import { PRCard } from './PRCard';
import { ConfluenceCard } from './ConfluenceCard';
import { JiraCard } from './JiraCard';
import { InterviewCard } from './InterviewCard';

interface ArtifactListProps {
  data: ArtifactsResponse | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_DISPLAY_COUNT = 5;

export function ArtifactList({ data, loading, error }: ArtifactListProps) {
  const [expandedPRs, setExpandedPRs] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState(false);
  const [expandedTickets, setExpandedTickets] = useState(false);
  const [expandedInterviews, setExpandedInterviews] = useState(false);

  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleGetSummary = async () => {
    if (!data) return;

    setSummaryLoading(true);
    setSummaryError(null);

    try {
      const result = await summarizeArtifacts(data);
      setSummary(result.summary);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading artifacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl">
        <div className="text-red-400">Error: {error}</div>
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

  const interviews = data.interviews || [];
  const totalCount =
    data.pull_requests.length +
    data.confluence_docs.length +
    data.jira_tickets.length +
    interviews.length;

  if (totalCount === 0) {
    return (
      <div className="text-center p-12 text-gray-500">
        No artifacts found for this period
      </div>
    );
  }

  const displayedPRs = expandedPRs
    ? data.pull_requests
    : data.pull_requests.slice(0, INITIAL_DISPLAY_COUNT);
  const displayedDocs = expandedDocs
    ? data.confluence_docs
    : data.confluence_docs.slice(0, INITIAL_DISPLAY_COUNT);
  const displayedTickets = expandedTickets
    ? data.jira_tickets
    : data.jira_tickets.slice(0, INITIAL_DISPLAY_COUNT);

  const displayedInterviews = expandedInterviews
    ? interviews
    : interviews.slice(0, INITIAL_DISPLAY_COUNT);

  const hiddenPRs = data.pull_requests.length - INITIAL_DISPLAY_COUNT;
  const hiddenDocs = data.confluence_docs.length - INITIAL_DISPLAY_COUNT;
  const hiddenTickets = data.jira_tickets.length - INITIAL_DISPLAY_COUNT;
  const hiddenInterviews = interviews.length - INITIAL_DISPLAY_COUNT;

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
        {!summary && !summaryLoading && (
          <button
            onClick={handleGetSummary}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get AI Summary
          </button>
        )}

        {summaryLoading && (
          <div className="flex items-center justify-center gap-3 py-3 text-gray-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating summary...
          </div>
        )}

        {summaryError && (
          <div className="text-red-400 text-sm">
            Error: {summaryError}
            <button
              onClick={handleGetSummary}
              className="ml-2 text-blue-400 hover:text-blue-300"
            >
              Retry
            </button>
          </div>
        )}

        {summary && (
          <div>
            {summary.includes('.env') || summary.includes('API key') || summary.includes('disabled') ? (
              // Configuration message
              <>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-400">Configuration Required</span>
                </div>
                <p className="text-gray-300">{summary}</p>
              </>
            ) : (
              // Actual AI summary
              <>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-400">AI Summary</span>
                </div>
                <p className="text-gray-200">{summary}</p>
              </>
            )}
            <button
              onClick={() => setSummary(null)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Artifacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pull Requests Column */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Pull Requests</h2>
            <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">
              {data.pull_requests.length}
            </span>
          </div>

          {data.pull_requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No pull requests
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayedPRs.map((pr, i) => (
                  <PRCard key={i} pr={pr} />
                ))}
              </div>

              {hiddenPRs > 0 && (
                <button
                  onClick={() => setExpandedPRs(!expandedPRs)}
                  className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {expandedPRs ? 'Show less' : `Show ${hiddenPRs} more`}
                </button>
              )}
            </>
          )}
        </div>

        {/* Confluence Documents Column */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Confluence</h2>
            <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">
              {data.confluence_docs.length}
            </span>
          </div>

          {data.confluence_docs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No documents
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayedDocs.map((doc, i) => (
                  <ConfluenceCard key={i} doc={doc} />
                ))}
              </div>

              {hiddenDocs > 0 && (
                <button
                  onClick={() => setExpandedDocs(!expandedDocs)}
                  className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {expandedDocs ? 'Show less' : `Show ${hiddenDocs} more`}
                </button>
              )}
            </>
          )}
        </div>

        {/* Jira Tickets Column */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Jira Tickets</h2>
            <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">
              {data.jira_tickets.length}
            </span>
          </div>

          {data.jira_tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tickets
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayedTickets.map((ticket, i) => (
                  <JiraCard key={i} ticket={ticket} />
                ))}
              </div>

              {hiddenTickets > 0 && (
                <button
                  onClick={() => setExpandedTickets(!expandedTickets)}
                  className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {expandedTickets ? 'Show less' : `Show ${hiddenTickets} more`}
                </button>
              )}
            </>
          )}
        </div>

        {/* Interviews Column */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Interviews</h2>
            <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">
              {interviews.length}
            </span>
          </div>

          {interviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No interviews
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayedInterviews.map((interview, i) => (
                  <InterviewCard key={i} interview={interview} />
                ))}
              </div>

              {hiddenInterviews > 0 && (
                <button
                  onClick={() => setExpandedInterviews(!expandedInterviews)}
                  className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {expandedInterviews ? 'Show less' : `Show ${hiddenInterviews} more`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
