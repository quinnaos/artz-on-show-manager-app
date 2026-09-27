'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Next.js reuses the client-side cached page when a user navigates back
// to it (browser back button / swipe gesture), even though this page is
// dynamically rendered - so without this, hub progress percentages can
// look stuck at whatever they were before the user ticked things off
// somewhere else and came back. Forces a fresh server render each time.
export default function RefreshOnMount() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return null;
}
