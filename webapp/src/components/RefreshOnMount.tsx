'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Next.js reuses the client-side cached page when a user navigates back
// to it (browser back button / swipe gesture), even though this page is
// dynamically rendered - so without this, a page can show (and forms can
// silently resubmit) data from before the user's last visit. Forces a
// fresh server render each time this component mounts.
export default function RefreshOnMount() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return null;
}
