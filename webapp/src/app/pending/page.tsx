import { syncProfileAfterLogin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

export default async function PendingPage() {
  // The invite -> profile-row sync only otherwise runs once, right when
  // someone signs in. If an admin invites this email after that first
  // attempt, re-checking here is what makes "reload this page" (below)
  // actually true, instead of silently requiring a full sign-out/in.
  const result = await syncProfileAfterLogin();
  if (result === 'ok') redirect('/hubs');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
          Artz On Show
        </div>
        <h1 style={{ margin: '10px 0 0', font: "400 26px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>
          Access Pending
        </h1>
        <p style={{ marginTop: 14, font: "400 14px/1.55 var(--font-sans)", color: 'var(--ink-muted)' }}>
          You&rsquo;re signed in, but your email hasn&rsquo;t been added as a manager yet. Ask your admin to
          invite you, then reload this page.
        </p>
        <div style={{ marginTop: 20 }}>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
