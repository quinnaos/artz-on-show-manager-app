'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { completeSignIn } from './actions';

// Magic-link codes are single-use. Some email clients and corporate mail
// scanners (Apple Mail Privacy Protection, Microsoft Defender Safe Links,
// etc.) silently pre-fetch links in emails to check they're safe - which
// burns the code before the person ever taps it. Requiring an explicit
// button press here (instead of exchanging the code the moment this page
// loads) means an automated fetch just sees this screen and does nothing,
// while a real tap still completes sign-in.
function ConfirmSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');
  const [error, setError] = useState('');

  async function confirm() {
    if (!code) return;
    setStatus('working');
    setError('');
    const supabase = createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      setStatus('error');
      setError('This link has expired or was already used. Head back and request a new one.');
      return;
    }
    const result = await completeSignIn();
    router.push(result === 'ok' ? '/hubs' : '/pending');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <div
          style={{
            font: "500 10.5px/1 var(--font-mono)",
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
          }}
        >
          Artz On Show
        </div>

        {!code ? (
          <div style={{ marginTop: 28 }}>
            <div style={{ font: "500 15px/1.3 var(--font-sans)", color: 'var(--ink)' }}>Missing sign-in link</div>
            <div style={{ marginTop: 8, font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
              Open this page from the link in your email, or request a new one below.
            </div>
            <a
              href="/login"
              style={{
                marginTop: 20,
                display: 'block',
                padding: 15,
                borderRadius: 13,
                background: 'var(--accent)',
                color: '#fff',
                font: "500 14.5px/1 var(--font-sans)",
              }}
            >
              Back to sign in
            </a>
          </div>
        ) : (
          <div style={{ marginTop: 28 }}>
            <h1 style={{ margin: 0, font: "400 24px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>Finish signing in</h1>
            <div style={{ marginTop: 8, font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
              Tap below to confirm it&rsquo;s you and get into your account.
            </div>
            <button
              onClick={confirm}
              disabled={status === 'working'}
              style={{
                marginTop: 20,
                width: '100%',
                padding: 15,
                borderRadius: 13,
                background: 'var(--accent)',
                color: '#fff',
                font: "500 14.5px/1 var(--font-sans)",
                opacity: status === 'working' ? 0.6 : 1,
              }}
            >
              {status === 'working' ? 'Signing in…' : 'Confirm and sign in'}
            </button>
            {status === 'error' && (
              <div style={{ marginTop: 14 }}>
                <div style={{ font: "400 13px/1.5 var(--font-sans)", color: '#9b1c1c' }}>{error}</div>
                <a href="/login" style={{ marginTop: 8, display: 'inline-block', font: "500 13px/1 var(--font-sans)", color: 'var(--accent)' }}>
                  Request a new link
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmSignInPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmSignIn />
    </Suspense>
  );
}
