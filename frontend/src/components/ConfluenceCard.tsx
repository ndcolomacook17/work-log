import type { ConfluenceDoc } from '../api/types';

interface ConfluenceCardProps {
  doc: ConfluenceDoc;
}

export function ConfluenceCard({ doc }: ConfluenceCardProps) {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          {doc.title}
        </a>
        <span className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-300 border border-blue-700">
          {doc.space}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-400">{doc.summary}</p>
      <div className="mt-2 text-xs text-gray-600">{doc.created_at}</div>
    </div>
  );
}
