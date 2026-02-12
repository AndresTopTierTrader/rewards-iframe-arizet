import { useState, useEffect } from 'react';
import { fetchJSON, getUserRewardsRoute, getUserId } from '../utils/api';
import { mockGiveawayData } from '../utils/mockData';

// Normalize GET /api/iframe/rewards/{user_id} response to app shape.
// API returns: { reward, user, progress, ui }. We map reward → giveaway (with legacy field names)
// and ensure user has .id for claim; orders/rewards are not returned by API.
function normalizeRewardsResponse(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const { reward, user, progress, ui } = raw;
  const giveaway = reward
    ? {
        id: reward.reward_id,
        reward_id: reward.reward_id,
        status: reward.status,
        prize_name: reward.reward_name,
        reward_name: reward.reward_name,
        description: reward.reward_description,
        prize_image: reward.reward_image,
        price_usd: reward.reward_shown_usd_value ?? reward.value_usd,
        value_usd: reward.value_usd,
        prize_tickets: reward.value_tickets,
        value_tickets: reward.value_tickets,
        progress_pct: reward.progress_pct,
        start_at: reward.start_at,
        finished_at: reward.finished_at,
        unlocked_message: reward.unlocked_message,
        locked: reward.locked,
      }
    : null;
  return {
    giveaway,
    user: user
      ? {
          ...user,
          id: user.user_id ?? user.id,
          entries: user.entries ?? user.user_tickets ?? 0,
        }
      : null,
    progress: progress ?? {},
    ui: ui ?? {},
    orders: user?.orders ?? raw.orders ?? [],
    rewards: raw.rewards ?? [],
  };
}

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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockData = normalizeRewardsResponse({
        reward: {
          reward_id: 'fXHVo5uRLaEPsdNnjgSq',
          status: 'active',
          reward_name: 'Rolex Datejust 41',
          value_usd: 20921.93,
          reward_image: 'https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770323925/dfasa_xwwkog.png',
          value_tickets: 243000,
          reward_description: 'Win a stunning Rolex Datejust 41 watch! Participate in our community rewards program by making eligible purchases.',
          start_at: '2024-01-01T00:00:00Z',
          unlocked_message: 'Prize is still open! You can still win this prize.',
          locked: false,
        },
        progress: {
          display_pct: 105.5,
          current_tickets: 256500,
          user_tickets: 256500,
        },
        user: {
          user_id: '9999999999',
          name: 'Test User',
          email: 'test@example.com',
          entries: 256500,
        },
        ui: {
          canClaim: true,
          claimState: 'available',
          claimDisabledReason: null,
          ticketsNeeded: 0,
          progressText: 'Prize unlocked!',
        },
        orders: [],
        rewards: mockGiveawayData.past,
      });

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
      setData(normalizeRewardsResponse(result));
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
