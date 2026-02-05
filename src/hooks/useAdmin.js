import { useState, useEffect } from 'react';
import { fetchJSON, withAdmin, post, apiRoute } from '../utils/api';
import { mockAdminGiveaways, mockGiveawayStats } from '../utils/mockData';

export function useAdminGiveaways() {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchJSON(withAdmin(apiRoute('/admin/giveaways')));
      setGiveaways(data.data || []);
      setError(null);
      setUsingMockData(false);
    } catch (err) {
      // Use mock data on error
      console.warn('API call failed, using mock data:', err.message);
      setGiveaways(mockAdminGiveaways);
      setError(err.message);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { giveaways, loading, error, usingMockData, refetch: load };
}

export function useGiveawayStats(giveawayId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadStats = async (id) => {
    if (!id) {
      setStats(null);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchJSON(withAdmin(apiRoute(`/admin/giveaways/${id}/stats?limit=200`)));
      setStats(data);
      setError(null);
      setUsingMockData(false);
    } catch (err) {
      // Use mock data on error
      console.warn('API call failed, using mock data:', err.message);
      setStats(mockGiveawayStats);
      setError(err.message);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(giveawayId);
  }, [giveawayId]);

  return { stats, loading, error, usingMockData, refetch: () => loadStats(giveawayId) };
}
