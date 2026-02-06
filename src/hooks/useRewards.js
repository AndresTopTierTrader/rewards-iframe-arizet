import { useState, useEffect } from 'react';
import { fetchJSON, getUserRewardsRoute, getUserId } from '../utils/api';
import { mockGiveawayData, mockUserEntries } from '../utils/mockData';

export function useRewards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadRewards = async () => {
    const userId = getUserId();
    
    if (!userId) {
      // No token provided, use mock data
      console.warn('No token parameter found in URL. Using mock data.');
      const mockData = {
        giveaway: mockGiveawayData.giveaway,
        progress: {
          ...mockGiveawayData.progress,
          current_tickets: 3275,
        },
        user: {
          id: null,
          name: 'John Doe',
          email: 'john.doe@example.com',
          entries: mockUserEntries.entries,
        },
        orders: mockUserEntries.orders,
      };
      setData(mockData);
      setError('No token parameter found in URL. Add ?token=USER_ID to the URL.');
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await fetchJSON(getUserRewardsRoute(userId));
      
      // Transform the API response to match the expected structure
      const transformedData = {
        giveaway: result.giveaway,
        progress: {
          display_pct: result.progress?.display_pct || 0,
          true_pct: result.progress?.true_pct || 0,
          target_entries: result.progress?.target_entries || result.giveaway?.target_entries || 0,
          current_tickets: result.progress?.current_tickets || 0,
        },
        user: {
          id: result.user?.id || userId,
          name: result.user?.name || null,
          email: result.user?.email || null,
          entries: result.user?.entries || 0,
        },
        orders: result.orders || [],
      };
      
      setData(transformedData);
      setError(null);
      setUsingMockData(false);
    } catch (err) {
      // Use mock data on error so UI still renders
      console.warn('API call failed, using mock data:', err.message);
      const mockData = {
        giveaway: mockGiveawayData.giveaway,
        progress: {
          ...mockGiveawayData.progress,
          current_tickets: 3275,
        },
        user: {
          id: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          entries: mockUserEntries.entries,
        },
        orders: mockUserEntries.orders,
      };
      setData(mockData);
      setError(err.message);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
    const interval = setInterval(loadRewards, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    usingMockData, 
    refetch: loadRewards 
  };
}
