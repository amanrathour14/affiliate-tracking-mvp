import { useState, useEffect } from 'react';
import { affiliateAPI } from '../lib/api';

export function useAffiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        setLoading(true);
        const data = await affiliateAPI.getAffiliates();
        setAffiliates(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch affiliates');
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  return { affiliates, loading, error, refetch: () => fetchAffiliates() };
}

export function useAffiliateData(affiliateId) {
  const [data, setData] = useState({
    affiliate: null,
    clicks: [],
    conversions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!affiliateId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [affiliatesData, clicksData, conversionsData] = await Promise.all([
          affiliateAPI.getAffiliates(),
          affiliateAPI.getAffiliateClicks(affiliateId),
          affiliateAPI.getAffiliateConversions(affiliateId)
        ]);

        const affiliate = affiliatesData.find(a => a.id == affiliateId);
        
        setData({
          affiliate,
          clicks: clicksData,
          conversions: conversionsData
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch affiliate data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [affiliateId]);

  return { ...data, loading, error };
}
