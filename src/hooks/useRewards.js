import { useState, useEffect } from 'react';
import { fetchJSON, getUserRewardsRoute, getUserId } from '../utils/api';
import { mockGiveawayData, mockUserEntries } from '../utils/mockData';

export function useRewards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadRewards = async () => {
    const userId = getUserId();
    
    if (!userId) {
      setError('No token parameter found in URL. Add ?token=USER_ID to the URL.');
      setErrorStatus(400);
      setLoading(false);
      return;
    }

    // Special case: test-finished token shows mock data with completed progress
    if (userId === 'test-finished') {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = {
        giveaway: {
          id: 'fXHVo5uRLaEPsdNnjgSq', // Use actual giveaway ID format
          status: 'active',
          prize_name: 'Rolex Datejust 41',
          price_usd: 20921.93,
          prize_image: 'https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770323925/dfasa_xwwkog.png',
          prize_tickets: 243000,
          description: 'Win a stunning Rolex Datejust 41 watch! Participate in our community rewards program by making eligible purchases.',
          start_at: '2024-01-01T00:00:00Z',
          unlocked_message: 'Prize is still open! You can still win this prize.',
          locked: false,
          blocked: false,
        },
        progress: {
          display_pct: 105.5, // Above 100% to show claim button
          current_tickets: 256500, // More than prize_tickets
        },
        user: {
          id: 9999999999,
          name: 'Test User',
          email: 'test@example.com',
          entries: 256500, // User has enough entries
        },
        orders: [
          {
            id: 1,
            date_created: '2024-01-15T10:30:00Z',
            product_name: 'Forex - Pro Challenge - 5K - MatchTrader - NONE',
            entries: 125000,
            status: 'completed',
          },
          {
            id: 2,
            date_created: '2024-01-20T14:20:00Z',
            product_name: 'Forex - Pro Challenge - 10K - MatchTrader - NONE',
            entries: 131500,
            status: 'completed',
          },
        ],
        rewards: mockGiveawayData.past,
      };
      
      setData(mockData);
      setError(null);
      setErrorStatus(null);
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setErrorStatus(null);
      const result = await fetchJSON(getUserRewardsRoute(userId));
      
      // API response structure matches the new schema
      // No transformation needed - use response as-is
      setData(result);
      setError(null);
      setErrorStatus(null);
      setUsingMockData(false);
    } catch (err) {
      console.error('API call failed:', err);
      setError(err.message || 'Failed to load rewards data');
      setErrorStatus(err.status || err.statusCode || 500);
      setData(null);
      setUsingMockData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
    // No auto-refresh - only refresh when user clicks the refresh button
  }, []);

  return { 
    data, 
    loading, 
    error,
    errorStatus,
    usingMockData, 
    refetch: loadRewards 
  };
}
