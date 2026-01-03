'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import styles from '../Profile.module.css';
import Loader from '@/app/components/Loader/Loader';
import ProfileStoriesGrid from '@/app/components/ProfileStoriesGrid/ProfileStoriesGrid';

import { getCurrentUser } from '@/lib/api/clientApi';
import {
  fetchMyOwnStories,
  type ProfileStoriesResponse,
} from '@/lib/api/profile';

function EmptyState({
  title,
  buttonText,
  onClick,
}: {
  title: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className={styles.emptyCard}>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <button type="button" className={styles.emptyButton} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}

export default function OwnStoriesPage() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    retry: false,
  });

  const queryKey = useMemo(
    () => ['profile-stories', 'own', user?._id],
    [user?._id],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery<ProfileStoriesResponse>({
    queryKey,
    enabled: Boolean(user?._id),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchMyOwnStories({
        page: Number(pageParam),
        perPage: 9,
        ownerId: user!._id,
      }),
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const items = data?.pages?.flatMap((p) => p.items ?? []) ?? [];
  const handleCreateStory = () => router.push('/stories/create');

  if (!user) return null;

  return (
    <section className={styles.content} aria-label="own stories">
      {isLoading && (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      )}

      {!isLoading && isError && (
        <div className={styles.errorBox}>
          <p className={styles.error}>
            Помилка завантаження історій. Спробуйте ще раз.
          </p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => refetch()}
          >
            Повторити
          </button>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          title="Ви ще нічого не публікували, поділіться своєю першою історією"
          buttonText="Опублікувати історію"
          onClick={handleCreateStory}
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <ProfileStoriesGrid
          stories={items}
          isOwn
          onLoadMore={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </section>
  );
}
