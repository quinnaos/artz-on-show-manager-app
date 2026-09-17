'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { HUBS } from '@/lib/data/hubs';

async function requireOwner() {
  const profile = await getProfile();
  if (!profile || profile.role !== 'owner') throw new Error('Owner access required');
  return profile;
}

function hubIdsFromForm(formData: FormData): string[] {
  return HUBS.map((h) => h.id).filter((id) => formData.get(`hub_${id}`) === 'on');
}

export async function inviteManager(formData: FormData) {
  await requireOwner();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const role = formData.get('role') === 'owner' ? 'owner' : 'manager';
  if (!email) return;
  const hubIds = role === 'owner' ? [] : hubIdsFromForm(formData);

  const supabase = await createClient();
  await supabase.from('invited_emails').upsert({ email, role, hub_ids: hubIds });
  revalidatePath('/admin');
}

export async function removeInvite(email: string) {
  await requireOwner();
  const supabase = await createClient();
  await supabase.from('invited_emails').delete().eq('email', email);
  revalidatePath('/admin');
}

export async function updateManagerHubs(profileId: string, formData: FormData) {
  await requireOwner();
  const hubIds = hubIdsFromForm(formData);
  const supabase = await createClient();
  await supabase.from('manager_hubs').delete().eq('profile_id', profileId);
  if (hubIds.length) {
    await supabase.from('manager_hubs').insert(hubIds.map((hub_id) => ({ profile_id: profileId, hub_id })));
  }
  revalidatePath('/admin');
}

export async function removeManager(profileId: string) {
  const owner = await requireOwner();
  if (owner.id === profileId) throw new Error("You can't remove your own access.");
  const supabase = await createClient();
  await supabase.from('profiles').delete().eq('id', profileId);
  revalidatePath('/admin');
}
