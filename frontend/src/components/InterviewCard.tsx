import type { Interview } from '../api/types';

interface InterviewCardProps {
  interview: Interview;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-900/50 text-blue-300 border border-blue-700',
    completed: 'bg-green-900/50 text-green-300 border border-green-700',
    cancelled: 'bg-red-900/50 text-red-300 border border-red-700',
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors overflow-hidden">
      <div className="text-gray-200 font-medium break-words">
        {interview.candidate_name}
      </div>
      <div className="mt-1 text-sm text-gray-400 break-words">
        {interview.job_title}
      </div>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className="px-2 py-1 text-xs rounded-full shrink-0 bg-purple-900/50 text-purple-300 border border-purple-700">
          {interview.interview_type}
        </span>
        <span
          className={`px-2 py-1 text-xs rounded-full shrink-0 ${statusColors[interview.status.toLowerCase()] || 'bg-gray-800 text-gray-400 border border-gray-700'}`}
        >
          {interview.status}
        </span>
      </div>
      {interview.scheduled_at && (
        <p className="mt-2 text-sm text-gray-500">{interview.scheduled_at}</p>
      )}
    </div>
  );
}
