'use client';

import { useRouter } from 'next/navigation';
import styles from './ProfileStoriesGrid.module.css';

import type { Story } from '@/types/story';
import { StoryCard } from '@/app/components/StoryCard/StoryCard';

type Props = {
  stories: Story[];
  isOwn: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function ProfileStoriesGrid({
  stories,
  isOwn,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const router = useRouter();

  return (
    <>
      <ul className={styles.list}>
        {stories.map((story) => (
          <li key={story._id} className={styles.item}>
            {isOwn ? (
              <div className={styles.ownCard}>
                <StoryCard story={story} />
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => router.push(`/stories/${story._id}/edit`)}
                >
                  Редагувати
                </button>
              </div>
            ) : (
              <StoryCard story={story} />
            )}
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div className={styles.paginationWrapper}>
          <button
            type="button"
            className={styles.loadMoreButton}
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Завантаження...' : 'Показати ще'}
          </button>
        </div>
      )}
    </>
  );
}
