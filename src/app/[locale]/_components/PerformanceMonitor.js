"use client";

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals monitoring
    if (typeof window !== 'undefined') {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Send to analytics
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'LCP',
              value: Math.round(entry.startTime),
              event_category: 'Web Vitals',
            });
          }
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              event_category: 'Web Vitals',
            });
          }
        }
      }).observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals',
          });
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // Monitor resource loading
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.duration > 1000) { // Track slow resources
            // Could send to analytics if needed
          }
        }
      }).observe({ entryTypes: ['resource'] });
    }
  }, []);

  return null; // This component doesn't render anything
}
