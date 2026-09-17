import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

// Reads the current user's profile + hub assignments. Returns null if the
// user isn't signed in, or hasn't been invited yet (no profiles row).
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile) return null;

  const { data: hubs } = await supabase.from('manager_hubs').select('hub_id').eq('profile_id', user.id);

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    hubIds: (hubs ?? []).map((h) => h.hub_id),
  };
}

// Called right after a successful magic-link sign-in. If the user doesn't
// have a profile yet, checks the invite allow-list (or the bootstrap owner
// email) and creates one. Uses the service role key because this runs before
// the user has any rows of their own to be granted access by RLS.
export async function syncProfileAfterLogin(): Promise<'ok' | 'pending'> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return 'pending';

  const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
  if (existing) return 'ok';

  const admin = createAdminClient();
  const email = user.email.toLowerCase();

  const { data: invite } = await admin
    .from('invited_emails')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase();
  const isBootstrapOwner = !invite && ownerEmail && email === ownerEmail;

  if (!invite && !isBootstrapOwner) return 'pending';

  const role = invite?.role ?? 'owner';
  const hubIds: string[] = invite?.hub_ids ?? [];

  const { error } = await admin.from('profiles').insert({ id: user.id, email, role, name: null });
  if (error) return 'pending';

  if (hubIds.length) {
    await admin.from('manager_hubs').insert(hubIds.map((hub_id) => ({ profile_id: user.id, hub_id })));
  }
  if (invite) {
    await admin.from('invited_emails').delete().eq('email', email);
  }
  return 'ok';
}
