import type { PullRequest } from '../api/types';

interface PRCardProps {
  pr: PullRequest;
}

export function PRCard({ pr }: PRCardProps) {
  const stateColors: Record<string, string> = {
    merged: 'bg-purple-900/50 text-purple-300 border border-purple-700',
    open: 'bg-green-900/50 text-green-300 border border-green-700',
    closed: 'bg-red-900/50 text-red-300 border border-red-700',
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          {pr.title}
        </a>
        <span
          className={`px-2 py-1 text-xs rounded-full ${stateColors[pr.state] || 'bg-gray-800 text-gray-400'}`}
        >
          {pr.state}
        </span>
      </div>
      <div className="mt-1 text-sm text-gray-500">{pr.repo}</div>
      <p className="mt-2 text-sm text-gray-400">{pr.summary}</p>
      <div className="mt-2 text-xs text-gray-600">{pr.created_at}</div>
    </div>
  );
}
