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
    <div className='rpc-param-modal' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
      <div className='rpc-param-modal__panel'>
        <button
          type='button'
          className='rpc-method__copy rpc-param-modal__close'
          onClick={() => setOpen(false)}
          aria-label='Close'
        >
          <XMarkIcon width={22} aria-hidden='true' />
        </button>

        <h3 id='modal-title' className='rpc-param-modal__title'>
          {currentParam.description || currentParam.name}
        </h3>

        {(() => {
          const examples = currentParam.schema?.examples;
          if (Array.isArray(examples) && examples.length > 0) {
            return (
              <div>
                <div className='rpc-param-modal__label'>Example value</div>
                <div className='rpc-method__example-body'>
                  <SyntaxHighlighter
                    language='javascript'
                    customStyle={{
                      backgroundColor: 'transparent',
                      margin: 0,
                    }}
                  >
                    {JSON.stringify(examples[0], null, 2)}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          }
          return (
            <p className='rpc-param-modal__label'>
              No example value is included in this OpenRPC schema.
            </p>
          );
        })()}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            type='button'
            className='rpc-button'
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
