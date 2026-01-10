import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

interface WeekPickerProps {
  selectedDate: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekPicker({ selectedDate, onWeekChange }: WeekPickerProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  const goToPreviousWeek = () => {
    onWeekChange(addWeeks(selectedDate, -1));
  };

  const goToNextWeek = () => {
    onWeekChange(addWeeks(selectedDate, 1));
  };

  const goToCurrentWeek = () => {
    onWeekChange(new Date());
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <button
        onClick={goToPreviousWeek}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
      >
        ← Previous
      </button>

      <div className="text-center">
        <div className="text-lg font-semibold">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </div>
        <div className="text-sm text-gray-500">
          Week of {format(weekStart, 'MMMM d')}
        </div>
      </div>

      <button
        onClick={goToNextWeek}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
      >
        Next →
      </button>

      <button
        onClick={goToCurrentWeek}
        className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded ml-2"
      >
        Today
      </button>
    </div>
  );
}
