// Utility functions for iframe embedding

/**
 * Check if the app is running inside an iframe
 */
export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

/**
 * Send height to parent window (for auto-resizing iframe)
 */
export function sendHeightToParent() {
  if (!isInIframe()) return;
  
  const height = document.documentElement.scrollHeight;
  window.parent.postMessage(
    {
      type: 'iframe-resize',
      height: height,
      source: 'tx3-rewards-iframe'
    },
    '*' // In production, specify the parent origin for security
  );
}

/**
 * Initialize iframe auto-resize
 */
export function initIframeResize() {
  if (!isInIframe()) return;

  let lastHeight = 0;
  let resizeTimer;

  const sendHeightIfChanged = () => {
    const currentHeight = document.documentElement.scrollHeight;
    // Only send if height actually changed (prevents unnecessary messages)
    if (Math.abs(currentHeight - lastHeight) > 5) {
      lastHeight = currentHeight;
      sendHeightToParent();
    }
  };

  // Send initial height
  sendHeightIfChanged();

  // Throttled resize handler
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sendHeightIfChanged, 150);
  };

  window.addEventListener('resize', handleResize);

  // Throttled MutationObserver to detect content changes
  const observer = new MutationObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sendHeightIfChanged, 150);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Send height after images load
  window.addEventListener('load', () => {
    setTimeout(sendHeightIfChanged, 500);
  });

  // Periodic check (fallback)
  const intervalId = setInterval(sendHeightIfChanged, 2000);

  // Cleanup function (if needed)
  return () => {
    window.removeEventListener('resize', handleResize);
    observer.disconnect();
    clearInterval(intervalId);
    clearTimeout(resizeTimer);
  };
}

/**
 * Listen for messages from parent window
 */
export function listenToParentMessages(callback) {
  window.addEventListener('message', (event) => {
    // In production, verify event.origin for security
    if (event.data && event.data.type === 'iframe-action') {
      callback(event.data);
    }
  });
}
