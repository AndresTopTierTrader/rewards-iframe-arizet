// Mock data for development when API is unavailable

export const mockGiveawayData = {
  giveaway: {
    id: 1,
    mode: 'demo',
    status: 'active',
    prize_name: 'Rolex Datejust 41',
    prize_image: 'https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770323925/dfasa_xwwkog.png',
    prize_msrp_usd: 20000,
    description: 'Win a stunning Rolex Datejust 41 watch! Participate in our community rewards program by making eligible purchases.',
    start_at: '2024-01-01T00:00:00Z',
    unlocked_message: 'Unlocked! We\'ll announce the winner on social media and reach out by email.',
    revenue_target_usd: 400000,
    target_entries: 5000,
  },
  progress: {
    display_pct: 65.5,
    true_pct: 65.5,
    target_entries: 5000,
  },
  past: [
    {
      id: 2,
      prize_name: 'Omega Seamaster',
      prize_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      winner_display: 'user***@example.com',
      unlocked_at: '2023-12-15T10:30:00Z',
    },
    {
      id: 3,
      prize_name: 'Apple Watch Ultra',
      prize_image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
      winner_display: 'winner***@example.com',
      unlocked_at: '2023-11-20T14:15:00Z',
    },
  ],
};

export const mockUserEntries = {
  entries: 42.5,
  orders: [
    {
      id: 1,
      date_created: '2024-01-15T10:30:00Z',
      product_name: 'Premium Trading Package',
      entries: 10,
      status: 'completed',
    },
    {
      id: 2,
      date_created: '2024-01-20T14:20:00Z',
      product_name: 'Advanced Analytics Suite',
      entries: 15.5,
      status: 'completed',
    },
    {
      id: 3,
      date_created: '2024-02-01T09:15:00Z',
      product_name: 'Professional Trading Tools',
      entries: 17,
      status: 'completed',
    },
  ],
};

export const mockAdminGiveaways = [
  {
    id: 1,
    mode: 'demo',
    status: 'active',
    is_current: 1,
    prize_name: 'Rolex Datejust 41',
    revenue_target_usd: 400000,
    target_entries: 5000,
    start_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    mode: 'demo',
    status: 'unlocked',
    is_current: 0,
    prize_name: 'Omega Seamaster',
    revenue_target_usd: 300000,
    target_entries: 4000,
    start_at: '2023-12-01T00:00:00Z',
    winner_display: 'user***@example.com',
    winner_drawn_at: '2023-12-15T10:30:00Z',
  },
  {
    id: 3,
    mode: 'live',
    status: 'draft',
    is_current: 0,
    prize_name: 'Apple Watch Ultra',
    revenue_target_usd: 200000,
    target_entries: 3000,
    start_at: null,
  },
];

export const mockGiveawayStats = {
  giveaway: {
    id: 1,
    mode: 'demo',
    status: 'active',
    is_current: 1,
    prize_name: 'Rolex Datejust 41',
    title: 'Community Rewards',
    revenue_target_usd: 400000,
    target_entries: 5000,
    start_at: '2024-01-01T00:00:00Z',
  },
  totals: {
    total_entries: 3275,
    user_count: 142,
    orders_count: 89,
  },
  progress: {
    true_pct: 65.5,
    target_entries: 5000,
  },
  participants: [
    { email: 'user1@example.com', entries: 125, probability: 0.0382 },
    { email: 'user2@example.com', entries: 98, probability: 0.0299 },
    { email: 'user3@example.com', entries: 87, probability: 0.0265 },
    { email: 'user4@example.com', entries: 76, probability: 0.0232 },
    { email: 'user5@example.com', entries: 65, probability: 0.0198 },
  ],
};
