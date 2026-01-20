import { Routes, Route, useLocation } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MonthViewPage } from './pages/MonthViewPage';
import { WeekViewPage } from './pages/WeekViewPage';
import { DateRangeView } from './pages/DateRangeView';
import { PullRequestsPage } from './pages/PullRequestsPage';
import { PullRequestsMonthPage } from './pages/PullRequestsMonthPage';
import { PullRequestsWeekPage } from './pages/PullRequestsWeekPage';
import { ConfluenceDocsPage } from './pages/ConfluenceDocsPage';
import { ConfluenceMonthPage } from './pages/ConfluenceMonthPage';
import { ConfluenceWeekPage } from './pages/ConfluenceWeekPage';
import { JiraTicketsPage } from './pages/JiraTicketsPage';
import { JiraMonthPage } from './pages/JiraMonthPage';
import { JiraWeekPage } from './pages/JiraWeekPage';
import { GreenhousePage } from './pages/GreenhousePage';
import { GreenhouseMonthPage } from './pages/GreenhouseMonthPage';
import { GreenhouseWeekPage } from './pages/GreenhouseWeekPage';

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-950">
      {!isLandingPage && <NavBar />}
      <Routes>
        {/* Landing and Dashboard */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/month/:year/:month" element={<MonthViewPage />} />
        <Route path="/week/:startDate/:endDate" element={<WeekViewPage />} />
        <Route path="/range/:startDate/:endDate" element={<DateRangeView />} />

        {/* Pull Requests */}
        <Route path="/pull-requests" element={<PullRequestsPage />} />
        <Route path="/pull-requests/month/:year/:month" element={<PullRequestsMonthPage />} />
        <Route path="/pull-requests/week/:startDate/:endDate" element={<PullRequestsWeekPage />} />

        {/* Confluence */}
        <Route path="/confluence" element={<ConfluenceDocsPage />} />
        <Route path="/confluence/month/:year/:month" element={<ConfluenceMonthPage />} />
        <Route path="/confluence/week/:startDate/:endDate" element={<ConfluenceWeekPage />} />

        {/* Jira */}
        <Route path="/jira" element={<JiraTicketsPage />} />
        <Route path="/jira/month/:year/:month" element={<JiraMonthPage />} />
        <Route path="/jira/week/:startDate/:endDate" element={<JiraWeekPage />} />

        {/* Greenhouse */}
        <Route path="/greenhouse" element={<GreenhousePage />} />
        <Route path="/greenhouse/month/:year/:month" element={<GreenhouseMonthPage />} />
        <Route path="/greenhouse/week/:startDate/:endDate" element={<GreenhouseWeekPage />} />
      </Routes>
    </div>
  );
}

export default App;
