import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { WeekPicker } from './components/WeekPicker';
import { ArtifactList } from './components/ArtifactList';
import { fetchArtifacts } from './api/client';
import type { ArtifactsResponse } from './api/types';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState<ArtifactsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtifacts = async () => {
      setLoading(true);
      setError(null);

      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

      try {
        const result = await fetchArtifacts(
          format(weekStart, 'yyyy-MM-dd'),
          format(weekEnd, 'yyyy-MM-dd')
        );
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artifacts');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadArtifacts();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Work Output Dashboard
        </h1>

        <div className="mb-6">
          <WeekPicker
            selectedDate={selectedDate}
            onWeekChange={setSelectedDate}
          />
        </div>

        <ArtifactList data={data} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default App;
