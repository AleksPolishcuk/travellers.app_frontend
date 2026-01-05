'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import styles from './Profile.module.css';

import Loader from '@/app/components/Loader/Loader';
import { getCurrentUser } from '@/lib/api/clientApi';
import { fetchMyOwnStories, fetchMySavedStories } from '@/lib/api/profile';

import TravellerInfo from '../profile/TravellerInfo/TravellerInfo';
import PageToggle from './components/PageToggle/PageToggle';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !user) router.replace('/auth/login');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user?._id) return;

    queryClient.prefetchInfiniteQuery({
      queryKey: ['profile-stories', 'saved', user._id],
      queryFn: ({ pageParam = 1 }) =>
        fetchMySavedStories({ page: Number(pageParam), perPage: 9 }),
      initialPageParam: 1,
    });

    queryClient.prefetchInfiniteQuery({
      queryKey: ['profile-stories', 'own', user._id],
      queryFn: ({ pageParam = 1 }) =>
        fetchMyOwnStories({
          page: Number(pageParam),
          perPage: 9,
          ownerId: user._id,
        }),
      initialPageParam: 1,
    });
  }, [user?._id, queryClient]);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.error}>
            Не вдалося завантажити профіль. Спробуйте увійти ще раз.
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <TravellerInfo user={user} />

        <section className={styles.controlsRow} aria-label="profile controls">
          <PageToggle />

          <Link href="/edit" className={styles.editButton}>
            Редагувати профіль
          </Link>
        </section>

        {children}
      </div>
    </main>
  );
}
