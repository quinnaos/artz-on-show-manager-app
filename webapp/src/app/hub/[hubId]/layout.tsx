import { redirect, notFound } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { hubById, HUBS } from '@/lib/data/hubs';
import { HubDataProvider } from '@/lib/hubData';
import TabBar from '@/components/TabBar';

export default async function HubLayout({ children, params }: LayoutProps<'/hub/[hubId]'>) {
  const { hubId } = await params;
  if (!HUBS.some((h) => h.id === hubId)) notFound();

  const profile = await getProfile();
  if (!profile) redirect('/pending');
  if (profile.role !== 'owner' && !profile.hubIds.includes(hubId)) redirect('/hubs');

  const hub = hubById(hubId);

  return (
    <HubDataProvider hubId={hub.id} profile={profile}>
      <div style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto', background: 'var(--surface)', paddingBottom: 90 }}>
        {children}
      </div>
      <TabBar hubId={hub.id} />
    </HubDataProvider>
  );
}
