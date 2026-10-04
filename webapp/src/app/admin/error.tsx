'use client';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <div style={{ padding: 16, background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 14 }}>
        <div style={{ font: "500 15px/1.3 var(--font-sans)", color: '#9B1C1C' }}>Something went wrong</div>
        <div style={{ marginTop: 6, font: "400 13.5px/1.5 var(--font-sans)", color: '#9B1C1C' }}>{error.message}</div>
        <button
          onClick={reset}
          style={{
            marginTop: 14,
            padding: '9px 15px',
            borderRadius: 99,
            border: '1px solid #FCA5A5',
            background: '#fff',
            font: "500 13px/1 var(--font-sans)",
            color: '#9B1C1C',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
