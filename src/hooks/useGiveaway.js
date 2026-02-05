import { useState, useEffect } from 'react';
import { fetchJSON, apiRoute } from '../utils/api';
import { mockGiveawayData } from '../utils/mockData';

export function useGiveaway() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadCurrent = async () => {
    try {
      setLoading(true);
      const result = await fetchJSON(apiRoute('/current'));
      setData(result);
      setError(null);
      setUsingMockData(false);
    } catch (err) {
      // Use mock data on error so UI still renders
      console.warn('API call failed, using mock data:', err.message);
      setData(mockGiveawayData);
      setError(err.message);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrent();
    const interval = setInterval(loadCurrent, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, usingMockData, refetch: loadCurrent };
}
