import api from './api';

export const postsService = {
  // Get all posts
  getAllPosts: async () => {
    const response = await api.get('/get-all-posts');
    // Normalize to array for FE components expecting a list
    return Array.isArray(response.data) ? response.data : (response.data?.posts || []);
  },

  // Get post by ID
  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Get posts to check
  getPostsToCheck: async (checkTime = null) => {
    const response = await api.post('/list-to-check', { checkTime });
    return response.data;
  },

  // Get unpublished posts
  getUnpublishedPosts: async () => {
    const response = await api.get('/unpublished-post');
    return response.data;
  },

  // Schedule a new post
  schedulePost: async (postData) => {
    const response = await api.post('/schedule-post', postData);
    return response.data;
  },

  // Update post status
  updatePostStatus: async (postId, post_id, status) => {
    const response = await api.post('/posts/update-status', {
      postId,
      post_id,
      status
    });
    return response.data;
  },

  // Generate content with AI
  generateContentWithGemini: async (prompt) => {
    const response = await api.post('/generate-content-gemini', { prompt });
    return response.data;
  },

  // Create embeddings
  createEmbeddings: async (text) => {
    const response = await api.post('/embed', { text });
    return response.data;
  }
,
  // Delete a post by ID
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  }
,
  // Get low engagement posts by threshold
  getLowEngagement: async (threshold = 5) => {
    const response = await api.get(`/engagement/low?threshold=${threshold}`);
    return response.data;
  }
,
  getEngagementForPost: async (postId) => {
    const response = await api.get(`/engagement/post/${postId}`);
    return response.data;
  }
};
