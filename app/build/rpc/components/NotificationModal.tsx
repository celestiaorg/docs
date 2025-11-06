'use client';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';

import { INotification } from '../lib/types';

export default function NotificationModal({
  notification,
  setNotification,
}: {
  notification: INotification;
  setNotification: (notification: INotification) => void;
}) {
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
      className='nx-pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6'
    >
      <div className='nx-flex w-full flex-col items-center space-y-4 sm:items-end'>
        <div className='nx-pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
          <div className='nx-p-4'>
            <div className='nx-flex items-start'>
              <div className='nx-flex-shrink-0'>
                {notification.success ? (
                  <CheckCircleIcon
                    className='nx-h-6 w-6 text-green-400'
                    aria-hidden='true'
                  />
                ) : (
                  <XCircleIcon
                    className='nx-h-6 w-6 text-red-400'
                    aria-hidden='true'
                  />
                )}
              </div>
              <div className='nx-ml-3 w-0 flex-1 pt-0.5'>
                <p className='nx-text-sm font-medium text-gray-900'>
                  {notification.success ? 'Success' : 'Error'}
                </p>
                <p className='nx-mt-1 text-sm text-gray-500'>
                  {notification.message}
                </p>
              </div>
              <div className='nx-ml-4 flex flex-shrink-0'>
                <button
                  type='button'
                  className='nx-inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                  onClick={() => {
                    setNotification({ ...notification, active: false });
                  }}
                >
                  <span className='nx-sr-only'>Close</span>
                  <XMarkIcon className='nx-h-5 w-5' aria-hidden='true' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

