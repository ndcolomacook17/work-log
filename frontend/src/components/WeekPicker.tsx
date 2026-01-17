import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

interface WeekPickerProps {
  selectedDate: Date;
  onWeekChange: (date: Date) => void;
  onSelectCustomDates?: () => void;
  showCustomDatesButton?: boolean;
}

export function WeekPicker({ selectedDate, onWeekChange, onSelectCustomDates, showCustomDatesButton = true }: WeekPickerProps) {
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
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
      <button
        onClick={goToPreviousWeek}
        className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg transition-colors"
      >
        &larr; Previous
      </button>

      <div className="text-center">
        <div className="text-lg font-semibold text-gray-100">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </div>
        <div className="text-sm text-gray-500">
          Week of {format(weekStart, 'MMMM d')}
        </div>
      </div>

      <button
        onClick={goToNextWeek}
        className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg transition-colors"
      >
        Next &rarr;
      </button>

      <button
        onClick={goToCurrentWeek}
        className="px-3 py-2 text-sm text-blue-400 hover:bg-blue-900/50 rounded-lg ml-2 transition-colors"
      >
        Today
      </button>

      {showCustomDatesButton && onSelectCustomDates && (
        <button
          onClick={onSelectCustomDates}
          className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg ml-auto border border-gray-700 transition-colors"
        >
          Select custom dates
        </button>
      )}
    </div>
  );
}
