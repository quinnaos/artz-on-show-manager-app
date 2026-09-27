'use server';

import { syncProfileAfterLogin } from '@/lib/auth';

// Called from the confirm page after the browser has already exchanged the
// magic-link code for a session (which sets the auth cookies). Runs
// server-side because it needs the service-role client to check the invite
// allow-list.
export async function completeSignIn() {
  return syncProfileAfterLogin();
}
