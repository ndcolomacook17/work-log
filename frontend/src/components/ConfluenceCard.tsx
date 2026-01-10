import type { ConfluenceDoc } from '../api/types';

interface ConfluenceCardProps {
  doc: ConfluenceDoc;
}

export function ConfluenceCard({ doc }: ConfluenceCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          {doc.title}
        </a>
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {doc.space}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-700">{doc.summary}</p>
      <div className="mt-2 text-xs text-gray-400">{doc.created_at}</div>
    </div>
  );
}
