'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ScrollToTopObserver() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScrollRestoration = () => {
      // Check for anchor hash in the URL (e.g. #mission)
      if (window.location.hash) {
        const id = decodeURIComponent(window.location.hash.substring(1));
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      // If no anchor is present, scroll to top of window
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    // Use requestAnimationFrame to ensure execution after reflow
    requestAnimationFrame(handleScrollRestoration);
  }, [pathname, searchParams]);

  return null;
}

import { Suspense } from 'react';

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopObserver />
    </Suspense>
  );
}
