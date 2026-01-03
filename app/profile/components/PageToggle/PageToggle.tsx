'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/profile/Profile.module.css';

export default function PageToggle() {
  const pathname = usePathname();

  const isSaved = pathname?.startsWith('/profile/saved');
  const isOwn = pathname?.startsWith('/profile/own');

  return (
    <div className={styles.tabs} role="tablist" aria-label="profile tabs">
      <Link
        href="/profile/saved"
        className={`${styles.tabButton} ${styles.tabLink} ${
          isSaved ? styles.tabButtonActive : ''
        }`}
        role="tab"
        aria-selected={isSaved}
      >
        Збережені історії
      </Link>

      <Link
        href="/profile/own"
        className={`${styles.tabButton} ${styles.tabLink} ${
          isOwn ? styles.tabButtonActive : ''
        }`}
        role="tab"
        aria-selected={isOwn}
      >
        Мої історії
      </Link>
    </div>
  );
}
