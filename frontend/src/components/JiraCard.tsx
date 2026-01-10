import type { JiraTicket } from '../api/types';

interface JiraCardProps {
  ticket: JiraTicket;
}

export function JiraCard({ ticket }: JiraCardProps) {
  const typeColors: Record<string, string> = {
    Bug: 'bg-red-100 text-red-800',
    Story: 'bg-green-100 text-green-800',
    Task: 'bg-blue-100 text-blue-800',
    Epic: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <a
            href={ticket.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            {ticket.key}: {ticket.title}
          </a>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${typeColors[ticket.type] || 'bg-gray-100'}`}
          >
            {ticket.type}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {ticket.status}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700">{ticket.summary}</p>
    </div>
  );
}
