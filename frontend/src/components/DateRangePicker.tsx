import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  addDays,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
} from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface DateRangePickerProps {
  className?: string;
  onCancel?: () => void;
}

export function DateRangePicker({ className = '', onCancel }: DateRangePickerProps) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (isBefore(day, startDate)) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const handleGetWork = () => {
    if (startDate && endDate) {
      const start = format(startDate, 'yyyy-MM-dd');
      const end = format(endDate, 'yyyy-MM-dd');
      navigate(`/range/${start}/${end}`);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 rounded transition-colors"
        >
          &lt;
        </button>
        <span className="text-sm font-semibold text-gray-200">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 rounded transition-colors"
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <div className="grid grid-cols-7 mb-1">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isStart = startDate && isSameDay(day, startDate);
        const isEnd = endDate && isSameDay(day, endDate);
        const isInRange =
          startDate &&
          endDate &&
          isAfter(day, startDate) &&
          isBefore(day, endDate);

        let cellClass = 'py-1 text-center text-sm cursor-pointer transition-colors ';

        if (!isCurrentMonth) {
          cellClass += 'text-gray-600 ';
        } else if (isStart || isEnd) {
          cellClass += 'bg-blue-600 text-white rounded ';
        } else if (isInRange) {
          cellClass += 'bg-blue-900/50 text-blue-300 ';
        } else {
          cellClass += 'text-gray-300 hover:bg-gray-700 ';
        }

        days.push(
          <div
            key={day.toString()}
            className={cellClass}
            onClick={() => isCurrentMonth && handleDayClick(cloneDay)}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-24 ${className}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-700 shadow-2xl p-4 w-72">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-100">Select Date Range</h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              &times;
            </button>
          )}
        </div>

        {renderHeader()}
        {renderDays()}
        {renderCells()}

        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-400">
              {startDate && endDate ? (
                <span>
                  <span className="font-medium text-gray-300">{format(startDate, 'MMM d, yyyy')}</span>
                  {' to '}
                  <span className="font-medium text-gray-300">{format(endDate, 'MMM d, yyyy')}</span>
                </span>
              ) : startDate ? (
                <span>Select end date</span>
              ) : (
                <span>Select start date</span>
              )}
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={handleGetWork}
            disabled={!startDate || !endDate}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              startDate && endDate
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {startDate && endDate
              ? `Get work from ${format(startDate, 'MMM d')} to ${format(endDate, 'MMM d')}`
              : 'Get work from X to Y'}
          </button>
        </div>
      </div>
    </div>
  );
}
