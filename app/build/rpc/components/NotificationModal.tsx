'use client';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import { INotification } from '../lib/types';

export default function NotificationModal({
  notification,
  setNotification,
}: {
  notification: INotification;
  setNotification: (notification: INotification) => void;
}) {
  // Dark mode detection
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (notification.active) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, active: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification.active) return null;

  return (
    <div
      aria-live='assertive'
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001, // Higher than playground modal
        display: 'flex',
        alignItems: 'flex-end',
        padding: '1.5rem',
        pointerEvents: 'none'
      }}
    >
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        flexDirection: 'column', 
        alignItems: 'flex-end',
        gap: '1rem'
      }}>
        <div style={{ 
          pointerEvents: 'auto',
          width: '100%', 
          maxWidth: '24rem', 
          overflow: 'hidden', 
          borderRadius: '0.5rem', 
          backgroundColor: isDark ? '#1f2937' : 'white', 
          boxShadow: isDark 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: isDark ? '1px solid #374151' : '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                {notification.success ? (
                  <CheckCircleIcon
                    style={{ width: '1.5rem', height: '1.5rem', color: '#22c55e' }}
                    aria-hidden='true'
                  />
                ) : (
                  <XCircleIcon
                    style={{ width: '1.5rem', height: '1.5rem', color: '#ef4444' }}
                    aria-hidden='true'
                  />
                )}
              </div>
              <div style={{ marginLeft: '0.75rem', flex: 1, paddingTop: '0.125rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: isDark ? '#f9fafb' : '#111827' }}>
                  {notification.success ? 'Success' : 'Error'}
                </p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: isDark ? '#d1d5db' : '#6b7280' }}>
                  {notification.message}
                </p>
              </div>
              <div style={{ marginLeft: '1rem', display: 'flex', flexShrink: 0 }}>
                <button
                  type='button'
                  style={{ 
                    display: 'inline-flex',
                    borderRadius: '0.375rem',
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    border: 'none',
                    padding: '0.25rem'
                  }}
                  onClick={() => {
                    setNotification({ ...notification, active: false });
                  }}
                >
                  <span style={{ 
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    borderWidth: 0
                  }}>Close</span>
                  <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} aria-hidden='true' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

