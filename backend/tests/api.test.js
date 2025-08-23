// Simple test file to verify API endpoints
// Run with: node tests/api.test.js

const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Affiliate Tracking API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data);

    // Test get affiliates
    console.log('\n2. Testing get affiliates...');
    const affiliates = await axios.get(`${API_BASE}/affiliates`);
    console.log('✅ Affiliates:', affiliates.data.length, 'found');

    if (affiliates.data.length > 0) {
      const testAffiliateId = affiliates.data[0].id;
      
      // Test click tracking
      console.log('\n3. Testing click tracking...');
      const clickResponse = await axios.get(`${API_BASE}/click`, {
        params: {
          affiliate_id: testAffiliateId,
          campaign_id: 1,
          click_id: `test_${Date.now()}`
        }
      });
      console.log('✅ Click tracked:', clickResponse.data);

      // Test postback
      console.log('\n4. Testing postback...');
      const postbackResponse = await axios.get(`${API_BASE}/postback`, {
        params: {
          affiliate_id: testAffiliateId,
          click_id: `test_${Date.now()}`,
          amount: 99.99,
          currency: 'USD'
        }
      });
      console.log('✅ Postback:', postbackResponse.data);

      // Test affiliate clicks
      console.log('\n5. Testing affiliate clicks...');
      const clicks = await axios.get(`${API_BASE}/affiliates/${testAffiliateId}/clicks`);
      console.log('✅ Affiliate clicks:', clicks.data.length, 'found');

      // Test affiliate conversions
      console.log('\n6. Testing affiliate conversions...');
      const conversions = await axios.get(`${API_BASE}/affiliates/${testAffiliateId}/conversions`);
      console.log('✅ Affiliate conversions:', conversions.data.length, 'found');
    }

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
