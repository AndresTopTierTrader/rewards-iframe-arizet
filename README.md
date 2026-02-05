# TX3 Community Rewards - React Frontend

A React application for managing and displaying community rewards and giveaways.

## Setup

### Install Dependencies

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Configuration

All API calls are configured to use `http://localhost:8000/api/iframe/rewards/{route}`.

### Routes

- `/` - Community page (user-facing)
- `/embed/community` - Community page (for embedding)
- `/admin` - Admin panel

### API Endpoints

The app expects the following API endpoints:

- `GET /api/iframe/rewards/current` - Get current giveaway
- `GET /api/iframe/rewards/me` - Get user entries
- `GET /api/iframe/rewards/me/orders` - Get user orders
- `GET /api/iframe/rewards/admin/giveaways` - Get all giveaways (admin)
- `POST /api/iframe/rewards/admin/giveaways` - Create giveaway (admin)
- `GET /api/iframe/rewards/admin/giveaways/:id/stats` - Get giveaway stats (admin)
- `POST /api/iframe/rewards/admin/giveaways/:id/:action` - Perform action on giveaway (admin)
- `POST /api/iframe/rewards/admin/sync` - Sync orders (admin)

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── Hero.jsx
│   ├── OrdersTable.jsx
│   ├── PastRewards.jsx
│   └── GiveawayForm.jsx
├── hooks/           # Custom React hooks
│   ├── useGiveaway.js
│   ├── useUserEntries.js
│   └── useAdmin.js
├── pages/           # Page components
│   ├── Community.jsx
│   └── Admin.jsx
├── styles/          # CSS styles
│   └── app.css
├── utils/           # Utility functions
│   ├── api.js
│   └── formatters.js
├── App.jsx          # Main app component with routing
└── main.jsx         # Entry point
```

## Development Notes

- The app uses React Router for navigation
- All API calls include query parameters for `mode` (demo/live) and `admin_key` (for admin routes)
- The app auto-refreshes giveaway data every 60 seconds
- CSS classes match the original design system
