'use client'

import { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    // Define the ad options globally
    (window as any).atOptions = {
      key: '3928b3bde7117bfc8aa4314b3eee29d4',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {}
    };

    // Create the script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/3928b3bde7117bfc8aa4314b3eee29d4/invoke.js';
    script.async = true;

    const container = document.getElementById('ad-container');
    if (container) {
      container.appendChild(script);
    }

    // Optional cleanup (removes ad if component unmounts)
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      id="ad-container"
      style={{ width: '468px', height: '60px' }}
    >
      {/* Ad will be injected here */}
    </div>
  );
};

export default AdBanner;
