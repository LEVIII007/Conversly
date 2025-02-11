'use client';

import { motion } from 'framer-motion';
import { BarChart, LineChart, MessageSquare, ThumbsUp, Users, Star, AlertCircle } from 'lucide-react';

interface AnalyticsTabProps {
  chatbotId: string;
  analyticsData: any;
}

// Dummy feedback data
const recentFeedback = [
  { id: 1, rating: 5, message: "Very helpful and accurate responses!", date: "2024-03-15" },
  { id: 2, rating: 4, message: "Good but could be faster", date: "2024-03-14" },
  { id: 3, rating: 5, message: "Exactly what I needed!", date: "2024-03-14" },
  { id: 4, rating: 3, message: "Decent, but needs improvement in technical answers", date: "2024-03-13" },
];

function SectionHeader({ 
  title, 
  description,
  icon: Icon 
}: { 
  title: string; 
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
        <Icon className="w-5 h-5 text-pink-500" />
      </div>
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">
          {title}
        </h2>
        {description && (
          <p className="font-sans text-base text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
          <Icon className="w-5 h-5 text-pink-500" />
        </div>
        {trend && (
          <span className={`font-sans text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="font-heading text-2xl font-bold text-white mb-1">
        {value}
      </h3>
      <p className="font-sans text-base text-gray-400">
        {title}
      </p>
    </motion.div>
  );
}

function FeedbackCard({ feedback }: { feedback: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-xl p-4 flex items-start gap-4"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
          <Star className="w-4 h-4 text-pink-500" />
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-500' : 'text-gray-600'}`} 
                fill={i < feedback.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="font-sans text-sm text-gray-400">
            {new Date(feedback.date).toLocaleDateString()}
          </span>
        </div>
        <p className="font-sans text-base text-white">
          {feedback.message}
        </p>
      </div>
    </motion.div>
  );
}

export function AnalyticsTab({ chatbotId, analyticsData }: AnalyticsTabProps) {
  const stats = [
    {
      title: "Total Conversations",
      value: analyticsData?.responses || "2,847",
      icon: MessageSquare,
      trend: 12
    },
    {
      title: "Unique Users",
      value: analyticsData?.likes || "1,234",
      icon: Users,
      trend: 8
    },
    {
      title: "Average Rating",
      value: analyticsData?.dislikes || "4.8",
      icon: Star,
      trend: 3
    },
    {
      title: "Response Rate",
      value: analyticsData?.responseRate || "98%",
      icon: ThumbsUp,
      trend: -2
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
          <SectionHeader 
            title="Usage Trends" 
            description="Conversations over time"
            icon={LineChart}
          />
          {/* Add your chart component here */}
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
          <SectionHeader 
            title="Popular Topics" 
            description="Most discussed subjects"
            icon={BarChart}
          />
          {/* Add your chart component here */}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
        <SectionHeader 
          title="Recent Feedback" 
          description="Latest user reviews and ratings"
          icon={Star}
        />
        
        <div className="space-y-4">
          {recentFeedback.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      </div>

      {/* Alert Section */}
      {analyticsData?.alerts && analyticsData.alerts.length > 0 && (
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
          <SectionHeader 
            title="Alerts" 
            description="Issues requiring attention"
            icon={AlertCircle}
          />
          
          <div className="space-y-2">
            {analyticsData.alerts.map((alert: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-sans text-base">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
