'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { completeSignIn } from '@/app/auth/confirm/actions';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // Kept so an already-sent link still works, but entering the code
        // below is the primary path - it all happens in this one browser
        // session, so there's no "open it on another device/app" mismatch,
        // and no clickable link for mail scanners to pre-fetch and burn.
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
    } else {
      setStage('code');
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });
    if (error) {
      setBusy(false);
      setError('That code is wrong or has expired. Check the email and try again.');
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

        {stage === 'code' ? (
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                padding: '18px 19px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                textAlign: 'center',
              }}
            >
              <div style={{ font: "500 15px/1.3 var(--font-sans)", color: 'var(--ink)' }}>Check Your Email</div>
              <div style={{ marginTop: 8, font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
                We sent a sign-in code to <strong>{email}</strong>. Enter it below.
              </div>
            </div>

            <form onSubmit={verifyCode} style={{ marginTop: 16 }}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                autoFocus
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 13,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  font: "400 15px/1 var(--font-sans)",
                  letterSpacing: '.08em',
                  textAlign: 'center',
                }}
              />
              <button
                type="submit"
                disabled={busy}
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: 15,
                  borderRadius: 13,
                  background: 'var(--accent)',
                  color: '#fff',
                  font: "500 14.5px/1 var(--font-sans)",
                  textAlign: 'center',
                  opacity: busy ? 0.6 : 1,
                }}
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
              {error && <div style={{ marginTop: 10, font: "400 13px/1.5 var(--font-sans)", color: '#9b1c1c' }}>{error}</div>}
            </form>

            <button
              onClick={() => {
                setStage('email');
                setCode('');
                setError('');
              }}
              style={{
                marginTop: 14,
                width: '100%',
                textAlign: 'center',
                font: "500 13px/1 var(--font-sans)",
                color: 'var(--ink-faint)',
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={sendCode} style={{ marginTop: 28 }}>
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
              disabled={busy}
              style={{
                marginTop: 10,
                width: '100%',
                padding: 15,
                borderRadius: 13,
                background: 'var(--accent)',
                color: '#fff',
                font: "500 14.5px/1 var(--font-sans)",
                textAlign: 'center',
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? 'Sending code…' : 'Email me a sign-in code'}
            </button>
            {error && <div style={{ marginTop: 10, font: "400 13px/1.5 var(--font-sans)", color: '#9b1c1c' }}>{error}</div>}
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
          No password needed — we&rsquo;ll email you a code. Access is by invitation only.
        </div>
      </div>
    </div>
  );
}
