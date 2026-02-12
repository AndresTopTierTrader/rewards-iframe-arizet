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

## API Integration

### URL Token Parameter

The application reads the `token` parameter from the URL query string, which represents the `user_id`:

```
http://localhost:3000?token=8571833690
```

The `token` value (`8571833690` in this example) is used as the `user_id` in the API call.

### API Key Authentication

All API requests require authentication using the `ARIZET_ENDPOINT_API_KEY`. The API key can be provided in two ways:

1. **Header** (recommended): `X-Api-Key: YOUR_API_KEY` or `x-api-key: YOUR_API_KEY`
2. **Query Parameter**: `?apiKey=YOUR_API_KEY`

You can set the API key via environment variable `VITE_API_KEY` or pass it as a URL query parameter.

**Example:**
```bash
curl "http://localhost:8000/api/iframe/rewards/8571833690" \
  -H "X-Api-Key: YOUR_ARIZET_ENDPOINT_API_KEY"
```

### Main API Endpoint

**Endpoint:** `GET http://localhost:8000/api/iframe/rewards/{user_id}`

This single endpoint returns all user-specific data needed to populate the UI, including past rewards.

### Expected API Response Structure

```json
{
  "giveaway": {
    "id": "string",
    "status": "active",
    "prize_name": "Rolex Datejust 41",
    "price_usd": 20921.93,
    "prize_image": "https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770323925/dfasa_xwwkog.png",
    "prize_tickets": 243000,
    "description": "Win a stunning Rolex Datejust 41 watch! Participate in our community rewards program by making eligible purchases.",
    "start_at": "2024-01-01T00:00:00Z",
    "unlocked_message": "Prize is still open! You can still win this prize.",
    "locked": false,
    "blocked": false
  },
  "progress": {
    "display_pct": 65.5,
    "current_tickets": 3275
  },
  "user": {
    "id": 8571833690,
    "name": "John Doe",
    "email": "john@example.com",
    "entries": 3275
  },
  "orders": [
    {
      "id": 13913,
      "date_created": "2025-10-31T23:59:45.000Z",
      "product_name": "Forex - Pro Challenge - 5K - MatchTrader - NONE",
      "entries": 513,
      "status": "completed"
    }
  ],
  "rewards": [
    {
      "id": "string",
      "prize_name": "Omega Seamaster",
      "prize_image": "https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770325187/Frame_10_ngig4t.png",
      "winner_display": "user***@example.com",
      "unlocked_at": "2023-12-15T10:30:00Z"
    }
  ]
}
```

**Note:** When no active giveaway exists, `giveaway` will be `null`, but `progress` and `user.entries` are still computed from orders.

### Response Fields Explanation

#### `giveaway` (Object or null)
Current active giveaway information:
- `id` (string): Unique giveaway identifier
- `status` (string): Status of the giveaway (`"active"`, `"unlocked"`, `"scheduled"`, `"draft"`)
- `prize_name` (string): Name of the prize (e.g., "Rolex Datejust 41")
- `price_usd` (number): Price of the prize in USD
- `prize_image` (string): URL to the prize image
- `prize_tickets` (number): Target number of tickets needed to unlock the prize
- `description` (string): Description of the prize and giveaway
- `start_at` (string, ISO 8601): Start date/time of the giveaway
- `unlocked_message` (string, optional): Message to display when giveaway is unlocked
- `locked` (boolean): Whether the prize has been won by someone (`true` if someone has already won, `false` if the prize is still available)
- `blocked` (boolean): Whether the prize is blocked

#### `progress` (Object, required)
Progress information for the current giveaway:
- `display_pct` (number): Percentage to display in the progress bar (0-100), calculated as `(current_tickets / prize_tickets) × 100`, capped at 100
- `current_tickets` (number, **required**): Current total number of tickets/entries across all users. This is used to calculate how far the community is from unlocking the prize in the progress bar.

#### `user` (Object, required)
Current user information:
- `id` (number): User ID (should match the token from URL)
- `name` (string, optional): User's full name
- `email` (string): User's email address
- `entries` (number): Total entries/tickets for this user (same as `current_tickets`)

#### `orders` (Array, required)
List of eligible orders for the current user:
- `id` (number): Order identifier
- `date_created` (string, ISO 8601): Order creation date/time
- `product_name` (string): Name of the purchased product
- `entries` (number): Number of entries/tickets earned from this order (calculated from USD price using non-linear formula)
- `status` (string): Order status (e.g., `"completed"`, `"pending"`, `"cancelled"`)

#### `rewards` (Array, required)
List of past rewards (display only):
- `id` (string): Reward identifier
- `prize_name` (string): Name of the prize
- `prize_image` (string): URL to the prize image
- `winner_display` (string): Display name/email of the winner (may be masked)
- `unlocked_at` (string, ISO 8601): Date/time when the reward was unlocked

### Important Notes

1. **Past Rewards**: The `rewards` array contains past rewards for display purposes.

2. **Current Tickets**: The `progress.current_tickets` field is critical for the progress bar. It represents the total number of tickets across all users, not just the current user. The UI uses this to show how close the community is to unlocking the prize.

3. **Progress Calculation**: The progress bar displays `progress.display_pct` as a percentage, calculated as `(current_tickets / prize_tickets) × 100`, capped at 100.

4. **User Entries**: The `user.entries` field represents the current user's total entries, which is displayed in the "Your entries" section. This is the same value as `current_tickets` for the user.

5. **First Purchase Date**: The UI calculates the first purchase date from the `orders` array by finding the earliest `date_created` value.

6. **Prize Availability**: The `giveaway.locked` field is related to the product/prize itself, not the user. When `locked` is `true`, it means someone has already redeemed/won this prize - the UI will appear grayish and show a warning message. When `locked` is `false` and the giveaway status is `"unlocked"` or `"active"`, the prize is still available (shown as "Still available" in the UI) and a "Claim Prize" button will appear, allowing users to attempt to win the prize.

7. **No Active Giveaway**: When `giveaway` is `null`, the UI will still display user information and orders, but no active prize will be shown.

### Error Handling

The application handles the following error scenarios:

| Status Code | Description | UI Behavior |
|-------------|-------------|-------------|
| 400 | Missing `user_id` | Shows error screen with message |
| 401 | Invalid or missing API key | Shows error screen with authentication error |
| 422 | User not found | Shows error screen with "User Not Found" message |
| 500 | Internal server error | Shows error screen with error message |

All error screens include a "Try Again" button to retry the request.

### Loading States

- **Loading Spinner**: A smooth, animated loading spinner using Framer Motion is displayed while data is being fetched
- **Error Screen**: A clean, professional error screen is shown when API calls fail or user is not found

### Claim Prize Endpoint

When a user is eligible to claim the prize (giveaway is unlocked/active and `locked` is `false`), they can click the "Claim Prize" button which will make a POST request to:

**Endpoint:** `POST http://localhost:8000/api/iframe/rewards/{reward_id}/winner`

**Request Body:**
```json
{
  "user_id": 8571833690,
  "user_email": "john@example.com",
  "user_name": "John Doe",
  "claimed_at": "2024-02-15T10:30:00Z"
}
```

The `claimed_at` timestamp is automatically generated when the button is clicked (ISO 8601 format).

**Response:** The API should return a success response confirming the prize claim.

### Example API Call

```bash
# User ID from URL token parameter
curl "http://localhost:8000/api/iframe/rewards/8571833690" \
  -H "X-Api-Key: YOUR_ARIZET_ENDPOINT_API_KEY"
```

## Routes

- `/` - Community page (user-facing)
- `/embed/community` - Community page (for embedding)
- `/admin` - Admin panel

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── Hero.jsx
│   ├── OrdersTable.jsx
│   ├── PastRewards.jsx
│   ├── UserProfile.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorScreen.jsx
│   └── GiveawayForm.jsx
├── hooks/           # Custom React hooks
│   ├── useRewards.js
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
│   ├── formatters.js
│   └── mockData.js
├── App.jsx          # Main app component with routing
└── main.jsx         # Entry point
```

## Development Notes

- The app uses React Router for navigation
- All API calls are made to `http://localhost:8000/api/iframe/rewards/{user_id}`
- The `user_id` is extracted from the URL query parameter `token`
- API key authentication is required via `X-Api-Key` header or `apiKey` query parameter
- The app auto-refreshes data every 60 seconds
- CSS classes match the original design system
- The progress bar uses `current_tickets` and `prize_tickets` to show community progress toward unlocking the prize
- Loading states use smooth Framer Motion animations
- Error screens are clean and professional with retry functionality
