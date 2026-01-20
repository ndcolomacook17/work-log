import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaSeedling } from 'react-icons/fa';
import { SiJira, SiConfluence } from 'react-icons/si';

interface Integration {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'github',
    label: 'GitHub PRs',
    description: 'Pull requests you authored or reviewed',
    icon: <FaGithub className="w-6 h-6 text-gray-300" />,
  },
  {
    id: 'confluence',
    label: 'Confluence Docs',
    description: 'Pages you created or edited',
    icon: <SiConfluence className="w-6 h-6 text-blue-400" />,
  },
  {
    id: 'jira',
    label: 'Jira Tickets',
    description: 'Tickets you worked on or resolved',
    icon: <SiJira className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'greenhouse',
    label: 'Greenhouse Interviews',
    description: 'Interviews you conducted',
    icon: <FaSeedling className="w-6 h-6 text-green-500" />,
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const toggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedSources(INTEGRATIONS.map((i) => i.id));
  };

  const handleGetStarted = () => {
    const sourcesParam = selectedSources.join(',');
    navigate(`/dashboard?sources=${sourcesParam}`);
  };

  const allSelected = selectedSources.length === INTEGRATIONS.length;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Welcome to Work Log
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          View everything you've accomplished at over any time period. Get weekly, monthly, or half year summaries of your work to drive your performance reviews with real data, not just what lives in your head.
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-200">
            Select Integrations
          </h2>
          <button
            onClick={selectAll}
            disabled={allSelected}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${allSelected
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-blue-400 hover:bg-blue-900/50'
              }`}
          >
            Select All
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {INTEGRATIONS.map((integration) => {
            const isSelected = selectedSources.includes(integration.id);
            return (
              <label
                key={integration.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${isSelected
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSource(integration.id)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <div className="flex-shrink-0">
                  {integration.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-200">
                    {integration.label}
                  </div>
                  <div className="text-sm text-gray-400">
                    {integration.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <button
          onClick={handleGetStarted}
          disabled={selectedSources.length === 0}
          className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${selectedSources.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
        >
          {selectedSources.length > 0
            ? 'Get Started'
            : 'Select at least one integration'}
        </button>
      </div>
    </div>
  );
}
