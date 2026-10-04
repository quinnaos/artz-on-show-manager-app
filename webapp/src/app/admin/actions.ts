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
  const name = String(formData.get('name') || '').trim();
  const role = formData.get('role') === 'owner' ? 'owner' : 'manager';
  if (!email) return;
  const hubIds = role === 'owner' ? [] : hubIdsFromForm(formData);

  const supabase = await createClient();
  const { error } = await supabase.from('invited_emails').upsert({ email, name: name || null, role, hub_ids: hubIds });
  if (error) throw new Error(`Could not save invite: ${error.message}`);
  revalidatePath('/admin');
}

export async function updateManagerName(profileId: string, formData: FormData) {
  await requireOwner();
  const name = String(formData.get('name') || '').trim();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles').update({ name: name || null }).eq('id', profileId);
  if (error) throw new Error(`Could not save name: ${error.message}`);
  revalidatePath('/admin');
}

export async function removeInvite(email: string) {
  await requireOwner();
  const supabase = await createClient();
  const { error } = await supabase.from('invited_emails').delete().eq('email', email);
  if (error) throw new Error(`Could not remove invite: ${error.message}`);
  revalidatePath('/admin');
}

export async function updateManagerHubs(profileId: string, formData: FormData) {
  await requireOwner();
  const hubIds = hubIdsFromForm(formData);
  const supabase = await createClient();
  const { error: delError } = await supabase.from('manager_hubs').delete().eq('profile_id', profileId);
  if (delError) throw new Error(`Could not save hub access: ${delError.message}`);
  if (hubIds.length) {
    const { error: insError } = await supabase.from('manager_hubs').insert(hubIds.map((hub_id) => ({ profile_id: profileId, hub_id })));
    if (insError) throw new Error(`Could not save hub access: ${insError.message}`);
  }
  revalidatePath('/admin');
}

export async function removeManager(profileId: string) {
  const owner = await requireOwner();
  if (owner.id === profileId) throw new Error("You can't remove your own access.");
  const supabase = await createClient();
  const { error } = await supabase.from('profiles').delete().eq('id', profileId);
  if (error) throw new Error(`Could not remove access: ${error.message}`);
  revalidatePath('/admin');
}

export async function addWorkshop(formData: FormData) {
  await requireOwner();
  const hubId = String(formData.get('hub_id') || '');
  const startDate = String(formData.get('start_date') || '');
  const label = String(formData.get('label') || '').trim();
  if (!hubId || !startDate || !HUBS.some((h) => h.id === hubId)) return;

  const supabase = await createClient();
  const { error } = await supabase.from('workshops').insert({ hub_id: hubId, start_date: startDate, label: label || null });
  if (error) throw new Error(`Could not add workshop: ${error.message}`);
  revalidatePath('/admin');
}

export async function removeWorkshop(id: number) {
  await requireOwner();
  const supabase = await createClient();
  const { error } = await supabase.from('workshops').delete().eq('id', id);
  if (error) throw new Error(`Could not remove workshop: ${error.message}`);
  revalidatePath('/admin');
}
