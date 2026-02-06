// Example RewardsWidget component for embedding the iframe
// This should be used on the PARENT page (not in the iframe itself)

import { useEffect, useRef, useState, useCallback } from 'react';

export function RewardsWidget({ userId = '3474982656' }) {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(800);
  const messageHandlerRef = useRef(null);

  // Stable message handler using useCallback
  const handleMessage = useCallback((event) => {
    // Security: Verify origin in production
    // if (event.origin !== 'https://iframe.tx3funding.com') return;
    
    if (event.data && 
        event.data.type === 'iframe-resize' && 
        event.data.source === 'tx3-rewards-iframe') {
      const newHeight = event.data.height;
      // Only update if height actually changed to prevent unnecessary re-renders
      if (newHeight !== iframeHeight) {
        setIframeHeight(newHeight);
      }
    }
  }, [iframeHeight]);

  useEffect(() => {
    // Store handler in ref to avoid recreating listener
    messageHandlerRef.current = handleMessage;
    
    // Use the ref version in the actual listener to avoid dependency issues
    const stableHandler = (event) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(event);
      }
    };

    window.addEventListener('message', stableHandler);
    
    console.log('[RewardsWidget] Mounted. Iframe src:', `https://iframe.tx3funding.com/?token=${userId}`);
    
    return () => {
      console.log('[RewardsWidget] Unmounted, listener removed');
      window.removeEventListener('message', stableHandler);
    };
  }, [userId]); // Only depend on userId, not handleMessage

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <iframe
        ref={iframeRef}
        src={`https://iframe.tx3funding.com/?token=${userId}`}
        width="100%"
        height={iframeHeight}
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

// Alternative: Even more stable version without state updates
export function RewardsWidgetStable({ userId = '3474982656' }) {
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
