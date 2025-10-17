import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { analyticsService } from '../services/analyticsService';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CommentChart from '../components/Dashboard/CommentChart';
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedChart, setSelectedChart] = useState('comments');

  // Fetch analytics data
  const { data: analytics, loading: analyticsLoading, execute: fetchAnalytics } = useApi(
    () => analyticsService.getCommentAnalytics(
      getDateRange(selectedPeriod).start,
      getDateRange(selectedPeriod).end
    ),
    [selectedPeriod]
  );

  const { data: engagementMetrics, loading: engagementLoading } = useApi(
    () => analyticsService.getEngagementMetrics(selectedPeriod),
    [selectedPeriod]
  );

  const { data: aiAnalytics, loading: aiLoading } = useApi(
    analyticsService.getAIResponseAnalytics
  );

  const { data: sentimentData, loading: sentimentLoading } = useApi(
    () => analyticsService.getSentimentAnalysis(selectedPeriod),
    [selectedPeriod]
  );

  function getDateRange(period) {
    const end = new Date();
    const start = new Date();
    
    switch (period) {
      case '24h':
        start.setHours(start.getHours() - 24);
        break;
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
      default:
        start.setDate(start.getDate() - 7);
    }
    
    return { start: start.toISOString(), end: end.toISOString() };
  }

  const isLoading = analyticsLoading || engagementLoading || aiLoading || sentimentLoading;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Detailed insights into your comment system performance
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            className="input"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={() => fetchAnalytics()}
            className="btn-primary px-4 py-2"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.totalComments || 0}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +{analytics?.commentsGrowth || 0}%
                </span>
              </div>
            </div>
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.avgResponseTime || 0}s
              </p>
              <div className="flex items-center mt-1">
                <ArrowDownIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  -{analytics?.responseTimeImprovement || 0}%
                </span>
              </div>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Responses</p>
              <p className="text-2xl font-bold text-gray-900">
                {aiAnalytics?.totalResponses || 0}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {aiAnalytics?.successRate || 0}% success
                </span>
              </div>
            </div>
            <SparklesIcon className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {engagementMetrics?.engagementRate || 0}%
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +{engagementMetrics?.engagementGrowth || 0}%
                </span>
              </div>
            </div>
            <ChartBarIcon className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Comment Volume"
          subtitle="Comments received over time"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <CommentChart 
              data={analytics?.chartData || []} 
              type="line" 
            />
          )}
        </Card>

        <Card
          title="Response Time Distribution"
          subtitle="How quickly AI responds to comments"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <CommentChart 
              data={analytics?.responseTimeData || []} 
              type="bar" 
            />
          )}
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <Card
          title="Sentiment Analysis"
          subtitle="Comment sentiment distribution"
        >
          {sentimentLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-4">
              {sentimentData?.sentiments?.map((sentiment) => (
                <div key={sentiment.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        sentiment.type === 'positive' ? 'bg-green-500' :
                        sentiment.type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {sentiment.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {sentiment.count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sentiment.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Performance */}
        <Card
          title="AI Performance"
          subtitle="Response quality and accuracy"
        >
          {aiLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-bold text-green-600">
                  {aiAnalytics?.successRate || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response Length</span>
                <span className="text-sm font-bold text-gray-900">
                  {aiAnalytics?.avgResponseLength || 0} chars
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing Time</span>
                <span className="text-sm font-bold text-gray-900">
                  {aiAnalytics?.avgProcessingTime || 0}ms
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Engagement Metrics */}
        <Card
          title="Engagement Metrics"
          subtitle="User interaction statistics"
        >
          {engagementLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <span className="text-sm font-bold text-blue-600">
                  {engagementMetrics?.engagementRate || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reply Rate</span>
                <span className="text-sm font-bold text-gray-900">
                  {engagementMetrics?.replyRate || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Session Duration</span>
                <span className="text-sm font-bold text-gray-900">
                  {engagementMetrics?.avgSessionDuration || 0}m
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
