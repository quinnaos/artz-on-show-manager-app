'use server';

import { syncProfileAfterLogin } from '@/lib/auth';

// Called from the login page once the browser has verified the emailed
// code (which sets the auth cookies). Runs server-side because it needs
// the service-role client to check the invite allow-list.
export async function completeSignIn() {
  return syncProfileAfterLogin();
}
