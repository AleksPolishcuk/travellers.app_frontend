'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './StoryCard.module.css';
import { Story } from '@/types/story';
import { useUser } from '@/lib/hooks/useUser';
import { saveStory, removeSavedStory } from '@/lib/api/clientApi';

interface StoryCardProps {
  story: Story;
  initialSaved?: boolean; // ✅ додали
}

export function StoryCard({ story, initialSaved = false }: StoryCardProps) {
  const router = useRouter();
  const { user } = useUser();

  const [bookmarksCount, setBookmarksCount] = useState<number>(
    // ✅ правильне поле з бекенду
    // @ts-ignore
    story.favoriteCount ?? 0,
  );

  const [isSaved, setIsSaved] = useState<boolean>(initialSaved); // ✅
  const [loading, setLoading] = useState(false);

  const imgSrc = typeof story.img === 'string' ? story.img.trim() : '';
  const avatarSrc =
    typeof story.ownerId?.avatarUrl === 'string'
      ? story.ownerId.avatarUrl.trim()
      : '';

  const handleSaveClick = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (loading) return;

    setLoading(true);

    const next = !isSaved;
    setIsSaved(next);
    setBookmarksCount((prev) => Math.max(0, prev + (next ? 1 : -1)));

    try {
      if (next) {
        await saveStory(story._id);
      } else {
        await removeSavedStory(story._id);
      }
    } catch (err: any) {
      // rollback
      setIsSaved(!next);
      setBookmarksCount((prev) => Math.max(0, prev + (!next ? 1 : -1)));

      console.error('Помилка збереження:', err);
      alert(err?.message || 'Помилка збереження');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.listItem}>
      <div className={styles.storyImg}>
        {imgSrc ? (
          <img className={styles.listImg} src={imgSrc} alt={story.title} />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.storyContent}>
        <div className={styles.content}>
          <p className={styles.category}>{story.category?.name}</p>
          <h3 className={styles.title}>{story.title}</h3>
          <p className={styles.article}>
            {story.article
              ? story.article.substring(0, 90) + '...'
              : 'Опис відсутній'}
          </p>
        </div>

        <div className={styles.user}>
          <div className={styles.imgCard}>
            {avatarSrc ? (
              <img className={styles.userImg} src={avatarSrc} alt="" />
            ) : (
              <div className={styles.avatarPlaceholder} aria-hidden="true" />
            )}

            <div className={styles.userInfo}>
              <h4 className={styles.userName}>{story.ownerId?.name}</h4>

              <div className={styles.userContent}>
                <span className={styles.listDate}>{story.date}</span>
                <span className={styles.point}></span>

                <div className={styles.rate}>
                  <span className={styles.userCount}>{bookmarksCount}</span>
                  <svg viewBox="4 4 16 16" className={styles.userBookmark}>
                    <use href="/icons.svg#icon-bookmark"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.storyView}>
          <Link href={`/stories/${story._id}`}>
            <button type="button" className={styles.storyButton}>
              Переглянути статтю
            </button>
          </Link>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSaveClick}
            disabled={loading}
            aria-label={isSaved ? 'Видалити зі збережених' : 'Зберегти історію'}
          >
            <svg width="24" height="24">
              <use
                className={styles.icon}
                href={
                  isSaved
                    ? '/icons.svg#icon-bookmark-filled'
                    : '/icons.svg#icon-bookmark'
                }
              ></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
