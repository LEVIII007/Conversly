'use client';

import { useEffect, useState } from 'react';
import { BarChart, Activity, FileText } from 'lucide-react';


interface AnalyticsData {
  responses: number;
  likes: number;
  dislikes: number;
  citations: {
    [source: string]: {
      count: number;
      responses: number;
    }
  }
}

export function AnalyticsTab({ chatbotId }: { chatbotId: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/chatbot/${chatbotId}/analytics`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [chatbotId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Responses"
          value={analytics.responses}
          icon={<Activity className="w-4 h-4" />}
        />
        <StatCard
          title="Helpful Responses"
          value={analytics.likes}
          icon={<Activity className="w-4 h-4 text-green-500" />}
        />
        <StatCard
          title="Unhelpful Responses"
          value={analytics.dislikes}
          icon={<Activity className="w-4 h-4 text-red-500" />}
        />
      </div>

      {/* Source Usage */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Source Usage
        </h3>
        <div className="bg-card rounded-lg p-4">
          {Object.entries(analytics.citations).map(([source, data]) => (
            <div key={source} className="py-3 border-b last:border-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{source}</span>
                <span className="text-sm text-muted-foreground">
                  {data.responses} responses
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{
                    width: `${(data.count / analytics.responses) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
} 