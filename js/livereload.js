/**
 * Development Live Reload Script
 * Polls the server to detect file changes and auto-refreshes the page.
 * Remove this script before deploying to production.
 */
(function() {
  'use strict';
  
  // Disable in production (e.g. Vercel deployment)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return;
  }
  
  let lastContent = null;
  const CHECK_INTERVAL = 1500; // Check every 1.5 seconds
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Files to watch for changes
  const watchFiles = [
    currentPage,
    'css/style.css',
    'js/app.js',
    'js/data.js'
  ];
  
  async function getFileHash(url) {
    try {
      const response = await fetch(url + '?_t=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) return null;
      const text = await response.text();
      // Simple hash using string length + first/last chars + content sample
      let hash = text.length.toString();
      if (text.length > 0) {
        hash += '_' + text.charCodeAt(0) + '_' + text.charCodeAt(Math.floor(text.length / 2)) + '_' + text.charCodeAt(text.length - 1);
      }
      return hash;
    } catch (e) {
      return null;
    }
  }
  
  async function checkForChanges() {
    const hashes = [];
    for (const file of watchFiles) {
      const hash = await getFileHash(file);
      if (hash) hashes.push(hash);
    }
    
    const combined = hashes.join('|');
    
    if (lastContent === null) {
      lastContent = combined;
      return;
    }
    
    if (combined !== lastContent) {
      console.log('%c[LiveReload] Changes detected, refreshing...', 'color: #25D366; font-weight: bold;');
      lastContent = combined;
      window.location.reload();
    }
  }
  
  // Start polling
  setInterval(checkForChanges, CHECK_INTERVAL);
  
  console.log('%c[LiveReload] Active — watching for file changes every ' + (CHECK_INTERVAL/1000) + 's', 'color: #25D366; font-weight: bold;');
})();
