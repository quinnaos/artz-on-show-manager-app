'use client';

export default function PrintButton({ label = 'Save as PDF' }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        padding: '9px 15px',
        borderRadius: 99,
        border: '1px solid var(--border)',
        background: '#fff',
        font: "500 13px/1 var(--font-sans)",
        color: 'var(--accent)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
