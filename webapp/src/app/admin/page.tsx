import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { HUBS } from '@/lib/data/hubs';
import { inviteManager, removeInvite, updateManagerHubs, removeManager } from './actions';

export default async function AdminPage() {
  const profile = await getProfile();
  if (!profile) redirect('/pending');
  if (profile.role !== 'owner') redirect('/hubs');

  const supabase = await createClient();
  const [{ data: profiles }, { data: managerHubs }, { data: invites }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at'),
    supabase.from('manager_hubs').select('*'),
    supabase.from('invited_emails').select('*').order('created_at'),
  ]);

  const hubsFor = (profileId: string) => (managerHubs ?? []).filter((h) => h.profile_id === profileId).map((h) => h.hub_id);

  return (
    <div style={{ minHeight: '100vh', maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Admin</div>
          <h1 style={{ margin: '6px 0 0', font: "400 24px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>Managers &amp; Access</h1>
        </div>
        <Link href="/hubs" style={{ font: "500 13.5px/1 var(--font-sans)", color: 'var(--accent)' }}>
          &lsaquo; Back to hubs
        </Link>
      </div>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
          Invite a Manager
        </h2>
        <form action={inviteManager} style={{ marginTop: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
          <input
            name="email"
            type="email"
            required
            placeholder="manager@artzonshow.co.nz"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', font: "400 14px/1 var(--font-sans)" }}
          />
          <div style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ font: "400 13.5px/1 var(--font-sans)" }}>
              <input type="radio" name="role" value="manager" defaultChecked /> Manager
            </label>
            <label style={{ font: "400 13.5px/1 var(--font-sans)" }}>
              <input type="radio" name="role" value="owner" /> Owner (full access)
            </label>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {HUBS.map((h) => (
              <label key={h.id} style={{ font: "400 13.5px/1 var(--font-sans)" }}>
                <input type="checkbox" name={`hub_${h.id}`} /> {h.name}
              </label>
            ))}
          </div>
          <button
            type="submit"
            style={{ marginTop: 14, padding: '11px 18px', borderRadius: 10, background: 'var(--accent)', color: '#fff', font: "500 13.5px/1 var(--font-sans)" }}
          >
            Send invite
          </button>
          <div style={{ marginTop: 8, font: "400 12px/1.5 var(--font-sans)", color: 'var(--ink-faint)' }}>
            They&rsquo;ll gain access the moment they sign in with this email — no separate email is sent by this screen; ask them to visit the app and request a sign-in link.
          </div>
        </form>
      </section>

      {invites && invites.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
            Pending Invites
          </h2>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {invites.map((inv) => (
              <div key={inv.email} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "500 14px/1.3 var(--font-sans)" }}>{inv.email}</div>
                  <div style={{ marginTop: 2, font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)' }}>
                    {inv.role === 'owner' ? 'Owner' : (inv.hub_ids ?? []).map((id: string) => HUBS.find((h) => h.id === id)?.name ?? id).join(', ') || 'No hubs yet'}
                  </div>
                </div>
                <form action={removeInvite.bind(null, inv.email)}>
                  <button type="submit" style={{ font: "500 12.5px/1 var(--font-sans)", color: '#9B1C1C' }}>
                    Cancel
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 28 }}>
        <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
          Current Access
        </h2>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(profiles ?? []).map((p) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ font: "500 15px/1.3 var(--font-sans)" }}>
                    {p.name || p.email} {p.id === profile.id && <span style={{ color: 'var(--ink-faint)' }}>(you)</span>}
                  </div>
                  <div style={{ marginTop: 2, font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)' }}>
                    {p.email} &middot; {p.role === 'owner' ? 'Owner' : 'Manager'}
                  </div>
                </div>
                {p.id !== profile.id && (
                  <form action={removeManager.bind(null, p.id)}>
                    <button type="submit" style={{ font: "500 12.5px/1 var(--font-sans)", color: '#9B1C1C' }}>
                      Remove access
                    </button>
                  </form>
                )}
              </div>
              {p.role !== 'owner' && (
                <form action={updateManagerHubs.bind(null, p.id)} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  {HUBS.map((h) => (
                    <label key={h.id} style={{ font: "400 13px/1 var(--font-sans)" }}>
                      <input type="checkbox" name={`hub_${h.id}`} defaultChecked={hubsFor(p.id).includes(h.id)} /> {h.name}
                    </label>
                  ))}
                  <button type="submit" style={{ font: "500 12.5px/1 var(--font-sans)", color: 'var(--accent)' }}>
                    Save
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
