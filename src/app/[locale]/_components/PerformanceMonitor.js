"use client";

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observers = [];

    const observe = (types, callback) => {
      try {
        const obs = new PerformanceObserver(callback);
        obs.observe({ entryTypes: types });
        observers.push(obs);
      } catch {
        // Browser may not support certain entry types
      }
    };

    // LCP (Largest Contentful Paint)
    observe(['largest-contentful-paint'], (list) => {
      for (const entry of list.getEntries()) {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'LCP',
            value: Math.round(entry.startTime),
            event_category: 'Web Vitals',
          });
        }
      }
    });

    // FID (First Input Delay)
    observe(['first-input'], (list) => {
      for (const entry of list.getEntries()) {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'FID',
            value: Math.round(entry.processingStart - entry.startTime),
            event_category: 'Web Vitals',
          });
        }
      }
    });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    observe(['layout-shift'], (list) => {
      for (const entry of list.getEntries()) {
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
    });

    // Cleanup: disconnect all observers on unmount
    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return null;
}
