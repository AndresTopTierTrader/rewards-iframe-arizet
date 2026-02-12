# Fix for RewardsWidget Mount/Unmount Issue

If your `RewardsWidget` component is mounting and unmounting repeatedly, use one of these stable implementations:

## Problem

The issue occurs when the message listener causes state updates that trigger re-renders, creating an infinite loop.

## Solution 1: Direct DOM Manipulation (Recommended)

This version updates the iframe height directly without using React state, preventing re-renders:

```jsx
import { useEffect, useRef } from 'react';

export function RewardsWidget({ userId = '3474982656' }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // Security: Verify origin in production
      // if (event.origin !== 'https://iframe.tx3funding.com') return;
      
      if (event.data && 
          event.data.type === 'iframe-resize' && 
          event.data.source === 'tx3-rewards-iframe') {
        // Directly update iframe height without state
        if (iframeRef.current) {
          iframeRef.current.style.height = `${event.data.height}px`;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [userId]); // Only re-run if userId changes

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <iframe
        ref={iframeRef}
        src={`https://iframe.tx3funding.com/?token=${userId}`}
        width="100%"
        height="800"
        frameBorder="0"
        scrolling="no"
        style={{ 
          border: 'none', 
          minHeight: '400px',
          display: 'block',
          width: '100%'
        }}
        title="TX3 Community Rewards"
        loading="lazy"
      />
    </div>
  );
}
```

## Solution 2: Memoized Handler

If you need to use state, use a memoized handler:

```jsx
import { useEffect, useRef, useCallback } from 'react';

export function RewardsWidget({ userId = '3474982656' }) {
  const iframeRef = useRef(null);
  const messageHandlerRef = useRef(null);

  const handleMessage = useCallback((event) => {
    if (event.data?.type === 'iframe-resize' && 
        event.data.source === 'tx3-rewards-iframe') {
      if (iframeRef.current) {
        iframeRef.current.style.height = `${event.data.height}px`;
      }
    }
  }, []);

  useEffect(() => {
    messageHandlerRef.current = handleMessage;
    
    const stableHandler = (event) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(event);
      }
    };

    window.addEventListener('message', stableHandler);
    
    return () => {
      window.removeEventListener('message', stableHandler);
    };
  }, [userId, handleMessage]);

  return (
    <iframe
      ref={iframeRef}
      src={`https://iframe.tx3funding.com/?token=${userId}`}
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

## Key Points

1. **Don't update React state in the message handler** - This causes re-renders
2. **Update the DOM directly** - Use `iframeRef.current.style.height` instead of state
3. **Stable event listener** - Use `useRef` to store the handler and avoid recreating listeners
4. **Minimal dependencies** - Only include `userId` in the useEffect dependency array

## Testing

Test with:
```jsx
<RewardsWidget userId="3474982656" />
```

The component should mount once and stay mounted, only updating the iframe height when messages are received.
Please understand how the current logic inside my project works, specially the part using Arizet API