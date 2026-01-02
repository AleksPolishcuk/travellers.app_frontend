'use client';

import { useMemo } from 'react';
import { useScreenSize } from '@/lib/hooks/useScreenSize';

export function useStoriesPerPage() {
  const width = useScreenSize();

  return useMemo(() => {
    // desktop 1440+
    if (width >= 1440) return 6;
    // tablet + mobile
    return 4;
  }, [width]);
}
