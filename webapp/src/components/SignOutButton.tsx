'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton({ style }: { style?: React.CSSProperties }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
      }}
      style={{
        padding: '10px 16px',
        borderRadius: 99,
        border: '1px solid var(--border)',
        background: '#fff',
        font: "500 13px/1 var(--font-sans)",
        color: 'var(--accent)',
        ...style,
      }}
    >
      Sign out
    </button>
  );
}
