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
http://localhost:3000?token=19082913
```

The `token` value (`19082913` in this example) is used as the `user_id` in the API call.

### Main API Endpoint

**Endpoint:** `GET http://localhost:8000/api/iframe/rewards/{user_id}`

This single endpoint returns all user-specific data needed to populate the UI, **excluding past rewards**.

### Expected API Response Structure

```json
{
  "giveaway": {
    "id": 1,
    "status": "active",
    "prize_name": "Rolex Datejust 41",
    "price_id": 209213,
    "prize_image": "https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770323925/dfasa_xwwkog.png",
    "prize_msrp_usd": 20000,
    "description": "Win a stunning Rolex Datejust 41 watch! Participate in our community rewards program by making eligible purchases.",
    "start_at": "2024-01-01T00:00:00Z",
    "unlocked_message": "Prize is still open! You can still win this prize.",
    "locked": "false",
    "revenue_target_usd": 400000,
    "target_entries": 5000
  },
  "progress": {
    "display_pct": 65.5,
    "true_pct": 65.5,
    "target_entries": 5000,
    "current_tickets": 3275
  },
  "user": {
    "id": 19082913,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "entries": 42.5
  },
  "orders": [
    {
      "id": 1,
      "date_created": "2024-01-15T10:30:00Z",
      "product_name": "Flex Challenge",
      "entries": 10,
      "status": "completed"
    },
    {
      "id": 2,
      "date_created": "2024-01-20T14:20:00Z",
      "product_name": "Pro Challenge",
      "entries": 15.5,
      "status": "completed"
    },
    {
      "id": 3,
      "date_created": "2024-02-01T09:15:00Z",
      "product_name": "One Phase Challenge",
      "entries": 17,
      "status": "completed"
    }
  ],
  "rewards": [
    {
      "id": 2,
      "prize_name": "Omega Seamaster",
      "prize_image": "https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770325187/Frame_10_ngig4t.png",
      "winner_display": "user***@example.com",
      "unlocked_at": "2023-12-15T10:30:00Z"
    },
    {
      "id": 3,
      "prize_name": "Apple Watch Ultra",
      "prize_image": "https://res.cloudinary.com/dmkzxsw0i/image/upload/v1770325186/Frame_9_ld6arq.png",
      "winner_display": "winner***@example.com",
      "unlocked_at": "2023-11-20T14:15:00Z"
    }
  ]
}
```

### Response Fields Explanation

#### `giveaway` (Object, required)
Current active giveaway information:
- `id` (number): Unique giveaway identifier
- `mode` (string): Mode of the giveaway (`"demo"` or `"live"`)
- `status` (string): Status of the giveaway (`"active"`, `"unlocked"`, `"scheduled"`, `"draft"`)
- `prize_name` (string): Name of the prize (e.g., "Rolex Datejust 41")
- `prize_image` (string): URL to the prize image
- `prize_msrp_usd` (number): Manufacturer's suggested retail price in USD
- `description` (string): Description of the prize and giveaway
- `start_at` (string, ISO 8601): Start date/time of the giveaway
- `unlocked_message` (string, optional): Message to display when giveaway is unlocked
- `price_id` (number): Unique identifier for the prize
- `locked` (string): Whether the prize has been won by someone (`"true"` if someone else has already won, `"false"` if the prize is still available and the current user can still win)
- `revenue_target_usd` (number): Target revenue in USD to unlock the prize
- `target_entries` (number): Target number of entries needed to unlock the prize

#### `progress` (Object, required)
Progress information for the current giveaway:
- `display_pct` (number): Percentage to display in the progress bar (0-100)
- `true_pct` (number): Actual percentage of completion (0-100)
- `target_entries` (number): Target number of entries needed
- `current_tickets` (number, **required**): Current total number of tickets/entries across all users. This is used to calculate how far the user is from unlocking the prize in the progress bar.

#### `user` (Object, required)
Current user information:
- `id` (number): User ID (should match the token from URL)
- `name` (string, optional): User's full name
- `email` (string): User's email address
- `entries` (number): Total entries/tickets for this user

#### `orders` (Array, required)
List of eligible orders for the current user:
- `id` (number): Order identifier
- `date_created` (string, ISO 8601): Order creation date/time
- `product_name` (string): Name of the purchased product
- `entries` (number): Number of entries/tickets earned from this order
- `status` (string): Order status (e.g., `"completed"`, `"pending"`, `"cancelled"`)

### Important Notes

1. **Past Rewards**: Past rewards are **NOT** included in this response. They should be fetched from a separate endpoint if needed.

2. **Current Tickets**: The `progress.current_tickets` field is critical for the progress bar. It represents the total number of tickets across all users, not just the current user. The UI uses this to show how close the community is to unlocking the prize.

3. **Progress Calculation**: The progress bar displays `progress.display_pct` as a percentage, and the UI shows how many tickets (`current_tickets`) out of the target (`target_entries`) have been collected.

4. **User Entries**: The `user.entries` field represents the current user's total entries, which is displayed in the "Your entries" section.

5. **First Purchase Date**: The UI calculates the first purchase date from the `orders` array by finding the earliest `date_created` value.

6. **Prize Availability**: The `giveaway.locked` field is related to the product/prize itself, not the user. When `locked` is `"true"`, it means someone has already redeemed/won this prize - the UI will appear grayish and show a warning message. When `locked` is `"false"` and the giveaway status is `"unlocked"`, the prize is still available (shown as "Still available" in the UI) and a "Claim Prize" button will appear, allowing users to attempt to win the prize.

### Claim Prize Endpoint

When a user is eligible to claim the prize (giveaway is unlocked and `locked` is `"false"`), they can click the "Claim Prize" button which will make a POST request to:

**Endpoint:** `POST http://localhost:8000/api/iframe/rewards/{reward_id}/winner`

**Request Body:**
```json
{
  "user_id": 19082913,
  "user_email": "john.doe@example.com",
  "user_name": "John Doe",
  "claimed_at": "2024-02-15T10:30:00Z"
}
```

The `claimed_at` timestamp is automatically generated when the button is clicked (ISO 8601 format).

**Response:** The API should return a success response confirming the prize claim.

### Error Handling

If the API call fails, the application will:
- Display an error message
- Fall back to mock data for demonstration purposes (in development mode)
- Show a warning banner indicating mock data is being used

### Example API Call

```bash
# User ID from URL token parameter
curl http://localhost:8000/api/iframe/rewards/19082913
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
│   ├── formatters.js
│   └── mockData.js
├── App.jsx          # Main app component with routing
└── main.jsx         # Entry point
```

## Development Notes

- The app uses React Router for navigation
- All API calls are made to `http://localhost:8000/api/iframe/rewards/{user_id}`
- The `user_id` is extracted from the URL query parameter `token`
- The app auto-refreshes data every 60 seconds
- CSS classes match the original design system
- The progress bar uses `current_tickets` to show community progress toward unlocking the prize