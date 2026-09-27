import { NextResponse } from 'next/server';

// Kept as a plain redirect for any already-sent emails still pointing here.
// This must NOT exchange the code itself - email clients and corporate mail
// scanners silently pre-fetch links to check they're safe, which would burn
// the single-use code before the person ever taps it. Forwarding the code
// along as a query param is safe because /auth/confirm only exchanges it on
// an explicit button press.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.redirect(`${origin}/login`);
  return NextResponse.redirect(`${origin}/auth/confirm?code=${encodeURIComponent(code)}`);
}
