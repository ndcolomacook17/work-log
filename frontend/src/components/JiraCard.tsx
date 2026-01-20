import type { JiraTicket } from '../api/types';

interface JiraCardProps {
  ticket: JiraTicket;
}

export function JiraCard({ ticket }: JiraCardProps) {
  const typeColors: Record<string, string> = {
    Bug: 'bg-red-900/50 text-red-300 border border-red-700',
    Story: 'bg-green-900/50 text-green-300 border border-green-700',
    Task: 'bg-blue-900/50 text-blue-300 border border-blue-700',
    Epic: 'bg-purple-900/50 text-purple-300 border border-purple-700',
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors overflow-hidden">
      <a
        href={ticket.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 font-medium transition-colors block break-words"
      >
        {ticket.key}: {ticket.title}
      </a>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span
          className={`px-2 py-1 text-xs rounded-full shrink-0 ${typeColors[ticket.type] || 'bg-gray-800 text-gray-400 border border-gray-700'}`}
        >
          {ticket.type}
        </span>
        <span className="px-2 py-1 text-xs rounded-full shrink-0 bg-gray-800 text-gray-400 border border-gray-700">
          {ticket.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-400 break-words">{ticket.summary}</p>
    </div>
  );
}
