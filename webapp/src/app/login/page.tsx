'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus('error');
      setError(error.message);
    } else {
      setStatus('sent');
    }
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
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div
          style={{
            font: "500 10.5px/1 var(--font-mono)",
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
            textAlign: 'center',
          }}
        >
          Artz On Show
        </div>
        <h1
          style={{
            margin: '10px 0 0',
            font: "400 28px/1.15 var(--font-sans)",
            letterSpacing: '-.02em',
            textAlign: 'center',
          }}
        >
          Manager Sign In
        </h1>

        {status === 'sent' ? (
          <div
            style={{
              marginTop: 28,
              padding: '18px 19px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              textAlign: 'center',
            }}
          >
            <div style={{ font: "500 15px/1.3 var(--font-sans)", color: 'var(--ink)' }}>Check Your Email</div>
            <div style={{ marginTop: 8, font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
              We sent a sign-in link to <strong>{email}</strong>. Open it on this device to continue.
            </div>
          </div>
        ) : (
          <form onSubmit={sendLink} style={{ marginTop: 28 }}>
            <input
              type="email"
              required
              autoFocus
              placeholder="you@artzonshow.co.nz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 13,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                font: "400 15px/1 var(--font-sans)",
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                marginTop: 10,
                width: '100%',
                padding: 15,
                borderRadius: 13,
                background: 'var(--accent)',
                color: '#fff',
                font: "500 14.5px/1 var(--font-sans)",
                textAlign: 'center',
                opacity: status === 'sending' ? 0.6 : 1,
              }}
            >
              {status === 'sending' ? 'Sending link…' : 'Email me a sign-in link'}
            </button>
            {status === 'error' && (
              <div style={{ marginTop: 10, font: "400 13px/1.5 var(--font-sans)", color: '#9b1c1c' }}>{error}</div>
            )}
          </form>
        )}

        <div
          style={{
            marginTop: 22,
            font: "400 12.5px/1.5 var(--font-sans)",
            color: 'var(--ink-faint)',
            textAlign: 'center',
          }}
        >
          No password needed — we&rsquo;ll email you a link. Access is by invitation only.
        </div>
      </div>
    </div>
  );
}
