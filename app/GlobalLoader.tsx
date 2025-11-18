'use client';

import { useAuthStore } from '@/store/authStore';
import styles from './Home.module.css';

export default function GlobalLoader() {
  const isLoading = useAuthStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>Завантаження...</p>
      </div>
    </div>
  );
}