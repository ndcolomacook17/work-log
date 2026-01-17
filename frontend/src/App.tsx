import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { NavBar } from './components/NavBar';
import { WeekPicker } from './components/WeekPicker';
import { DateRangePicker } from './components/DateRangePicker';
import { ArtifactList } from './components/ArtifactList';
import { DateRangeView } from './pages/DateRangeView';
import { PullRequestsPage } from './pages/PullRequestsPage';
import { ConfluenceDocsPage } from './pages/ConfluenceDocsPage';
import { JiraTicketsPage } from './pages/JiraTicketsPage';
import { fetchArtifacts } from './api/client';
import type { ArtifactsResponse } from './api/types';

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState<ArtifactsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        Work Output Dashboard
      </h1>

      <div className="mb-6">
        <WeekPicker
          selectedDate={selectedDate}
          onWeekChange={setSelectedDate}
          onSelectCustomDates={() => setShowDateRangePicker(true)}
          showCustomDatesButton={!showDateRangePicker}
        />
      </div>

      {showDateRangePicker && (
        <DateRangePicker onCancel={() => setShowDateRangePicker(false)} />
      )}

      <ArtifactList data={data} loading={loading} error={error} />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/range/:startDate/:endDate" element={<DateRangeView />} />
        <Route path="/pull-requests" element={<PullRequestsPage />} />
        <Route path="/confluence" element={<ConfluenceDocsPage />} />
        <Route path="/jira" element={<JiraTicketsPage />} />
      </Routes>
    </div>
  );
}

export default App;
