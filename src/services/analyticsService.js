import api from './api';

export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get comment analytics by date range
  getCommentAnalytics: async (startDate, endDate) => {
    const response = await api.get('/analytics/comments', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  // Get engagement metrics
  getEngagementMetrics: async (period = '7d') => {
    const response = await api.get('/analytics/engagement', {
      params: { period }
    });
    return response.data;
  },

  // Get AI response analytics
  getAIResponseAnalytics: async () => {
    const response = await api.get('/analytics/ai-responses');
    return response.data;
  },

  // Get sentiment analysis data
  getSentimentAnalysis: async (period = '30d') => {
    const response = await api.get('/analytics/sentiment', {
      params: { period }
    });
    return response.data;
  },

  // Get response time analytics
  getResponseTimeAnalytics: async () => {
    const response = await api.get('/analytics/response-time');
    return response.data;
  }
};
