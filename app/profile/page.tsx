'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import styles from './Profile.module.css';

import Loader from '@/app/components/Loader/Loader';
import ProfileStoriesGrid from '@/app/components/ProfileStoriesGrid/ProfileStoriesGrid';

import { getCurrentUser } from '@/lib/api/clientApi';
import {
  fetchMySavedStories,
  fetchMyOwnStories,
  type ProfileStoriesResponse,
} from '@/lib/api/profile';

type Tab = 'saved' | 'own';

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

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('saved');

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    retry: false,
  });

  // redirect якщо не авторизований
  if (!isUserLoading && !user) {
    router.replace('/auth/login');
    return null;
  }

  const queryKey = useMemo(
    () => ['profile-stories', tab, user?._id],
    [tab, user?._id],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isStoriesLoading,
    isError: isStoriesError,
    refetch,
  } = useInfiniteQuery<ProfileStoriesResponse>({
    queryKey,
    enabled: Boolean(user?._id),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const page = Number(pageParam);
      const perPage = 9;

      return tab === 'saved'
        ? fetchMySavedStories({ page, perPage })
        : fetchMyOwnStories({ page, perPage, ownerId: user!._id });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasNextPage)
        return lastPage.pagination.page + 1;
      return undefined;
    },
  });

  const items = data?.pages?.flatMap((p) => p.items ?? []) ?? [];

  const handleExploreStories = () => router.push('/stories');
  const handleCreateStory = () => router.push('/stories/create');
  const handleEditProfile = () => router.push('/profile/edit');

  const showLoader = isUserLoading || (Boolean(user) && isStoriesLoading);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {showLoader && (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        )}

        {isUserError && (
          <p className={styles.error}>
            Не вдалося завантажити профіль. Спробуйте увійти ще раз.
          </p>
        )}

        {user && !showLoader && (
          <>
            {/* HEADER як на макеті */}
            <section className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.avatarWrap}>
                  <Image
                    src={user.avatarUrl || '/Avatar-Image@2x.jpg'}
                    alt={`Фото ${user.name}`}
                    width={168}
                    height={168}
                    className={styles.avatar}
                    priority
                  />
                </div>

                <div className={styles.meta}>
                  <h1 className={styles.userName}>{user.name}</h1>
                  {user.description ? (
                    <p className={styles.userBio}>{user.description}</p>
                  ) : (
                    <p className={styles.userBioEmpty}></p>
                  )}
                </div>
              </div>
            </section>

            {/* TABS + Edit button (ряд як на макеті) */}
            <section
              className={styles.controlsRow}
              aria-label="profile controls"
            >
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={`${styles.tabButton} ${tab === 'saved' ? styles.tabButtonActive : ''}`}
                  onClick={() => setTab('saved')}
                  aria-pressed={tab === 'saved'}
                >
                  Збережені історії
                </button>

                <button
                  type="button"
                  className={`${styles.tabButton} ${tab === 'own' ? styles.tabButtonActive : ''}`}
                  onClick={() => setTab('own')}
                  aria-pressed={tab === 'own'}
                >
                  Мої історії
                </button>
              </div>

              <button
                type="button"
                className={styles.editButton}
                onClick={handleEditProfile}
              >
                Редагувати профіль
              </button>
            </section>

            {/* CONTENT */}
            <section className={styles.content} aria-label="profile stories">
              {isStoriesError ? (
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
              ) : items.length === 0 ? (
                tab === 'saved' ? (
                  <EmptyState
                    title="У вас ще немає збережених історій, мерщій збережіть вашу першу історію!"
                    buttonText="До історій"
                    onClick={handleExploreStories}
                  />
                ) : (
                  <EmptyState
                    title="Ви ще нічого не публікували, поділіться своєю першою історією"
                    buttonText="Опублікувати історію"
                    onClick={handleCreateStory}
                  />
                )
              ) : (
                <ProfileStoriesGrid
                  stories={items}
                  isOwn={tab === 'own'}
                  onLoadMore={fetchNextPage}
                  hasNextPage={!!hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
