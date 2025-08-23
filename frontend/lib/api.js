import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const affiliateAPI = {
  // Get all affiliates
  getAffiliates: async () => {
    const response = await api.get('/affiliates');
    return response.data;
  },

  // Get affiliate clicks
  getAffiliateClicks: async (affiliateId) => {
    const response = await api.get(`/affiliates/${affiliateId}/clicks`);
    return response.data;
  },

  // Get affiliate conversions
  getAffiliateConversions: async (affiliateId) => {
    const response = await api.get(`/affiliates/${affiliateId}/conversions`);
    return response.data;
  },

  // Track click
  trackClick: async (affiliateId, campaignId, clickId) => {
    const response = await api.get('/click', {
      params: { affiliate_id: affiliateId, campaign_id: campaignId, click_id: clickId }
    });
    return response.data;
  },

  // Track conversion (postback)
  trackConversion: async (affiliateId, clickId, amount, currency) => {
    const response = await api.get('/postback', {
      params: { affiliate_id: affiliateId, click_id: clickId, amount, currency }
    });
    return response.data;
  }
};

export default api;
