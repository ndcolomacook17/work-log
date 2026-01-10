import type { PullRequest } from '../api/types';

interface PRCardProps {
  pr: PullRequest;
}

export function PRCard({ pr }: PRCardProps) {
  const stateColors: Record<string, string> = {
    merged: 'bg-purple-100 text-purple-800',
    open: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          {pr.title}
        </a>
        <span
          className={`px-2 py-1 text-xs rounded-full ${stateColors[pr.state] || 'bg-gray-100'}`}
        >
          {pr.state}
        </span>
      </div>
      <div className="mt-1 text-sm text-gray-500">{pr.repo}</div>
      <p className="mt-2 text-sm text-gray-700">{pr.summary}</p>
      <div className="mt-2 text-xs text-gray-400">{pr.created_at}</div>
    </div>
  );
}
