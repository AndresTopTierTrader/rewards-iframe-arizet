import { useState, useEffect } from 'react';
import { fetchJSON, apiRoute } from '../utils/api';
import { mockUserEntries } from '../utils/mockData';

export function useUserEntries() {
  const [entries, setEntries] = useState(null);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadMe = async () => {
    try {
      const me = await fetchJSON(apiRoute('/me'));
      const entriesValue = Number(me.entries || 0);
      setEntries(entriesValue);
      // Extract user data from API response
      setUser({
        name: me.name || me.full_name || null,
        email: me.email || null,
      });
      setAuthenticated(true);
      setError(null);
      setUsingMockData(false);
      return true;
    } catch (err) {
      // Use mock data on error for demo purposes
      console.warn('API call failed, using mock data:', err.message);
      setEntries(mockUserEntries.entries);
      setOrders(mockUserEntries.orders);
      // Use mock user data
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
      setAuthenticated(true); // Show as authenticated with mock data
      setError('Login required to see your entries. (Showing mock data)');
      setUsingMockData(true);
      return true; // Return true so orders load
    }
  };

  const loadOrders = async () => {
    try {
      const result = await fetchJSON(apiRoute('/me/orders'));
      setOrders(result.data || []);
      setUsingMockData(false);
    } catch (err) {
      // Use mock orders if API fails
      if (!usingMockData) {
        setOrders(mockUserEntries.orders);
        setUsingMockData(true);
      }
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const isAuth = await loadMe();
      if (isAuth) {
        await loadOrders();
      }
      setLoading(false);
    };
    loadAll();
  }, []);

  return { entries, orders, user, loading, error, authenticated, usingMockData, refetch: loadMe };
}
