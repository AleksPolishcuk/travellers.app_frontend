'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import styles from '../Profile.module.css';
import Loader from '@/app/components/Loader/Loader';
import ProfileStoriesGrid from '@/app/components/ProfileStoriesGrid/ProfileStoriesGrid';

import { getCurrentUser } from '@/lib/api/clientApi';
import {
  fetchMySavedStories,
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

export default function SavedStoriesPage() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    retry: false,
  });

  const queryKey = useMemo(
    () => ['profile-stories', 'saved', user?._id],
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
      fetchMySavedStories({ page: Number(pageParam), perPage: 9 }),
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const items = data?.pages?.flatMap((p) => p.items ?? []) ?? [];
  const handleExploreStories = () => router.push('/stories');

  if (!user) return null;

  return (
    <section className={styles.content} aria-label="saved stories">
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
          title="У вас ще немає збережених історій, мерщій збережіть вашу першу історію!"
          buttonText="До історій"
          onClick={handleExploreStories}
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <ProfileStoriesGrid
          stories={items}
          isOwn={false}
          onLoadMore={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </section>
  );
}
