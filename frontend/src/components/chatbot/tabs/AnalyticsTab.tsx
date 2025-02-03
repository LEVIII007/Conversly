'use client';

import { useEffect, useState } from 'react';
import { Activity, FileText } from 'lucide-react';
import { getAnalytics } from '@/lib/queries';

interface AnalyticsData {
  responses: number;
  likes: number;
  dislikes: number;
  citations: { source: string; count: number }[];  // ✅ Correct type
}

export function AnalyticsTab({ chatbotId }: { chatbotId: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const response = await getAnalytics(parseInt(chatbotId));

        if (!response) {
          console.error('Failed to fetch analytics: No response from server.');
          setAnalytics({
            responses: 0,
            likes: 0,
            dislikes: 0,
            citations: [], // ✅ Default to empty array
          });
          return;
        }

        if (response.responses === 0) {
          console.warn('No analytics data found for the chatbot. It may not have been used yet.');
          setAnalytics({
            responses: 0,
            likes: 0,
            dislikes: 0,
            citations: [], // ✅ Default to empty array
          });
          return;
        }

        // ✅ Ensure citations is always an array (default to [])
        const analyticsData: AnalyticsData = {
          responses: response.responses ?? 0,
          likes: response.likes ?? 0,
          dislikes: response.dislikes ?? 0,
          citations: response.citations?.map(citation => ({
            ...citation,
            count: citation.count ?? 0,
          })) ?? [], // ✅ Default to empty array
        };

        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalytics({
          responses: 0,
          likes: 0,
          dislikes: 0,
          citations: [], // ✅ Default to empty array
        });
      } finally {
        setLoading(false);
      }
    }

    if (chatbotId) {
      fetchAnalytics();
    }
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
        <StatCard title="Total Responses" value={analytics.responses} icon={<Activity className="w-4 h-4" />} />
        <StatCard title="Helpful Responses" value={analytics.likes} icon={<Activity className="w-4 h-4 text-green-500" />} />
        <StatCard title="Unhelpful Responses" value={analytics.dislikes} icon={<Activity className="w-4 h-4 text-red-500" />} />
      </div>

      {analytics.responses === 0 && (
        <div className="text-center text-muted-foreground">
          No one on your website has used the chatbot yet.
        </div>
      )}

      {/* Source Usage */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Source Usage
        </h3>
        <div className="bg-card rounded-lg p-4">
          {analytics.citations.length > 0 ? (
            analytics.citations.map(({ source, count }) => (
              <div key={source} className="py-3 border-b last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{source}</span>
                  <span className="text-sm text-muted-foreground">{count} responses</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{
                      width: `${(count / (analytics.responses || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No citations recorded yet.</div>
          )}
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
