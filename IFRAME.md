# Embedding TX3 Community Rewards as an Iframe

This guide explains how to embed the TX3 Community Rewards application as an iframe in your website.

## Quick Start

### Basic Embedding

```html
<iframe 
  src="https://your-domain.com/?token=USER_ID"
  width="100%" 
  height="800"
  frameborder="0"
  scrolling="no"
  style="border: none;"
></iframe>
```

### With Auto-Resize (Recommended)

The iframe automatically sends its height to the parent window. You can listen for these messages to auto-resize:

```html
<iframe 
  id="rewards-iframe"
  src="https://your-domain.com/?token=USER_ID"
  width="100%" 
  height="800"
  frameborder="0"
  scrolling="no"
  style="border: none;"
></iframe>

<script>
  const iframe = document.getElementById('rewards-iframe');
  
  window.addEventListener('message', (event) => {
    // Verify origin in production for security
    // if (event.origin !== 'https://your-domain.com') return;
    
    if (event.data && event.data.type === 'iframe-resize' && event.data.source === 'tx3-rewards-iframe') {
      iframe.style.height = event.data.height + 'px';
    }
  });
</script>
```

## URL Parameters

### Required Parameters

- `token` - The user ID (required)
  ```
  ?token=8571833690
  ```

### Optional Parameters

- `apiKey` - Override the default API key
  ```
  ?token=8571833690&apiKey=YOUR_API_KEY
  ```

## Example Embedding Code

### React Example

```jsx
import { useEffect, useRef } from 'react';

function RewardsWidget({ userId }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // Verify origin in production
      // if (event.origin !== 'https://your-domain.com') return;
      
      if (event.data?.type === 'iframe-resize' && event.data.source === 'tx3-rewards-iframe') {
        if (iframeRef.current) {
          iframeRef.current.style.height = `${event.data.height}px`;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`https://your-domain.com/?token=${userId}`}
      width="100%"
      height="800"
      frameBorder="0"
      scrolling="no"
      style={{ border: 'none', minHeight: '400px' }}
      title="TX3 Community Rewards"
    />
  );
}
```

### Vanilla JavaScript Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Page with Rewards</title>
  <style>
    .rewards-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    #rewards-iframe {
      width: 100%;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="rewards-container">
    <h1>Community Rewards</h1>
    <iframe 
      id="rewards-iframe"
      src="https://your-domain.com/?token=8571833690"
      width="100%" 
      height="800"
      frameborder="0"
      scrolling="no"
    ></iframe>
  </div>

  <script>
    const iframe = document.getElementById('rewards-iframe');
    
    window.addEventListener('message', (event) => {
      // Security: Verify origin in production
      // if (event.origin !== 'https://your-domain.com') return;
      
      if (event.data && 
          event.data.type === 'iframe-resize' && 
          event.data.source === 'tx3-rewards-iframe') {
        iframe.style.height = event.data.height + 'px';
      }
    });
  </script>
</body>
</html>
```

## Server Configuration

### Required Headers

Your server must send these headers to allow iframe embedding:

```
X-Frame-Options: ALLOWALL
# OR
X-Frame-Options: SAMEORIGIN
# OR remove X-Frame-Options entirely

Content-Security-Policy: frame-ancestors *;
# OR for specific domains:
Content-Security-Policy: frame-ancestors https://yourdomain.com https://anotherdomain.com;
```

### Vite/Express Example

If you're serving the built files with Express:

```javascript
app.use((req, res, next) => {
  // Allow iframe embedding
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', "frame-ancestors *;");
  next();
});
```

### Nginx Example

```nginx
location / {
    add_header X-Frame-Options "ALLOWALL" always;
    add_header Content-Security-Policy "frame-ancestors *;" always;
}
```

## Security Considerations

### 1. Origin Verification

Always verify the message origin in production:

```javascript
window.addEventListener('message', (event) => {
  // Only accept messages from trusted origin
  if (event.origin !== 'https://your-trusted-domain.com') {
    return;
  }
  
  // Handle message
});
```

### 2. HTTPS

Always use HTTPS in production for secure communication.

### 3. Content Security Policy

Configure CSP headers appropriately based on your security requirements.

## Styling the Iframe

### Full Width Container

```css
.rewards-iframe-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.rewards-iframe-container iframe {
  width: 100%;
  border: none;
  border-radius: 12px;
}
```

### Responsive Design

```css
.rewards-iframe-container {
  width: 100%;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .rewards-iframe-container {
    padding: 0 24px;
  }
}
```

## Troubleshooting

### Iframe Not Loading

1. **Check X-Frame-Options header**: The server must allow iframe embedding
2. **Check CORS**: Ensure CORS is properly configured
3. **Check console**: Look for errors in browser console

### Auto-Resize Not Working

1. **Check message listener**: Ensure the parent page is listening for messages
2. **Check origin**: Verify the origin matches (or use `*` for development)
3. **Check iframe source**: Ensure the iframe is loading the correct URL

### Content Not Displaying

1. **Check token parameter**: Ensure the `token` parameter is included
2. **Check API connectivity**: Verify the backend API is accessible
3. **Check browser console**: Look for JavaScript errors

## Testing

### Local Development

1. Start the dev server: `npm run dev`
2. Embed in a test HTML file:
   ```html
   <iframe src="http://localhost:3000/?token=test-finished"></iframe>
   ```

### Production Testing

1. Build the app: `npm run build`
2. Serve the `dist` folder
3. Test embedding from your production domain

## API Requirements

The iframe makes API calls to:
- `GET /api/iframe/rewards/{user_id}` - Fetch rewards data
- `PUT /api/rewards/giveaways/{giveaway_id}` - Claim prize

Ensure these endpoints are accessible from the iframe context and have proper CORS configuration.
