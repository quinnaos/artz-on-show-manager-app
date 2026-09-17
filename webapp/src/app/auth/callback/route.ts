import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncProfileAfterLogin } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const result = await syncProfileAfterLogin();
      return NextResponse.redirect(`${origin}${result === 'ok' ? '/hubs' : '/pending'}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
