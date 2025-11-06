'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { Param } from '../lib/types';

export default function ParamModal({
  open,
  setOpen,
  currentParam,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentParam: Param;
}) {
  if (!open) return null;

  return (
    <div className='nx-fixed nx-inset-0 nx-z-50 nx-overflow-y-auto' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
      <div className='nx-fixed nx-inset-0 nx-bg-gray-500 nx-bg-opacity-75 nx-transition-opacity' onClick={() => setOpen(false)} />

      <div className='nx-fixed nx-inset-0 nx-z-50 nx-overflow-y-auto'>
        <div className='nx-flex nx-min-h-full nx-items-end nx-justify-center nx-p-4 nx-text-center sm:nx-items-center sm:nx-p-0'>
          <div className='nx-relative nx-transform nx-rounded-lg nx-bg-white nx-px-4 nx-pb-4 nx-pt-5 nx-text-left nx-shadow-xl nx-transition-all dark:nx-bg-gray-900 sm:nx-my-8 sm:nx-w-full sm:nx-max-w-lg sm:nx-p-6'>
            <div className='nx-absolute nx-right-0 nx-top-0 nx-hidden nx-pr-4 nx-pt-4 sm:nx-block'>
              <button
                type='button'
                className='nx-rounded-md nx-bg-white nx-text-gray-400 hover:nx-text-gray-500 focus:nx-outline-none focus:nx-ring-2 focus:nx-ring-primary-500 focus:nx-ring-offset-2 dark:nx-bg-gray-900'
                onClick={() => setOpen(false)}
              >
                <span className='nx-sr-only'>Close</span>
                <XMarkIcon className='nx-h-6 nx-w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='nx-overflow-x-auto sm:nx-flex sm:nx-items-start'>
              <div className='nx-mt-3 nx-text-center sm:nx-ml-4 sm:nx-mt-0 sm:nx-text-left'>
                <h3
                  id='modal-title'
                  className='nx-text-lg nx-font-medium nx-leading-6 nx-text-gray-900 dark:nx-text-gray-100'
                >
                  {currentParam.description}
                </h3>
                <div className='nx-mt-2'>
                  {(() => {
                    const examples = currentParam.schema?.examples;
                    if (Array.isArray(examples) && examples.length > 0) {
                      return (
                        <p className='nx-text-sm nx-text-gray-500 dark:nx-text-gray-400'>
                          Example Value:
                          <SyntaxHighlighter
                            language='javascript'
                            customStyle={{
                              backgroundColor: 'transparent',
                            }}
                          >
                            {JSON.stringify(examples[0], null, '\t')}
                          </SyntaxHighlighter>
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
            <div className='nx-mt-5 sm:nx-mt-4 sm:nx-flex sm:nx-flex-row-reverse'>
              <button
                type='button'
                className='nx-mt-3 nx-inline-flex nx-w-full nx-justify-center nx-rounded-md nx-border nx-border-gray-300 nx-bg-white nx-px-4 nx-py-2 nx-text-base nx-font-medium nx-text-gray-700 nx-shadow-sm hover:nx-text-gray-500 focus:nx-outline-none focus:nx-ring-2 focus:nx-ring-primary-500 focus:nx-ring-offset-2 dark:nx-border-gray-700 dark:nx-bg-gray-800 dark:nx-text-gray-300 sm:nx-mt-0 sm:nx-w-auto sm:nx-text-sm'
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

