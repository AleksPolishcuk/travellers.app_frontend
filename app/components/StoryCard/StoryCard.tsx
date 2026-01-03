'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './StoryCard.module.css';
import { Story } from '@/types/story';
import { useUser } from '@/lib/hooks/useUser';
import { saveStory, removeSavedStory } from '@/lib/api/clientApi';

type Variant = 'default' | 'own';

interface StoryCardProps {
  story: Story;
  variant?: Variant; // ✅
}

export function StoryCard({ story, variant = 'default' }: StoryCardProps) {
  const router = useRouter();
  const { user } = useUser();

  const [bookmarksCount, setBookmarksCount] = useState<number>(
    // @ts-ignore
    story.bookmarksCount ??
      // @ts-ignore
      story.savedCount ??
      story.favoriteCount ??
      0,
  );

  const [isSaved, setIsSaved] = useState<boolean>(Boolean(story.isSaved));
  const [loading, setLoading] = useState(false);

  const handleSaveClick = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);

      if (isSaved) {
        await removeSavedStory(story._id);
        setBookmarksCount((prev) => Math.max(0, prev - 1));
        setIsSaved(false);
      } else {
        await saveStory(story._id);
        setBookmarksCount((prev) => prev + 1);
        setIsSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    router.push(`/stories/${story._id}/edit`);
  };

  const storyImgSrc = story?.img?.trim() ? story.img : '/placeholder-story.jpg';
  const ownerAvatarSrc = story?.ownerId?.avatarUrl?.trim()
    ? story.ownerId.avatarUrl
    : '/Avatar-Image.jpg';

  return (
    <div className={styles.listItem}>
      <div className={styles.storyImg}>
        <img className={styles.listImg} src={storyImgSrc} alt={story.title} />
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
            <img className={styles.userImg} src={ownerAvatarSrc} alt="" />

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

          {variant === 'own' ? (
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleEditClick}
              aria-label="Редагувати статтю"
            >
              <svg width="24" height="24">
                <use href="/icons.svg#icon-edit"></use>
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSaveClick}
              disabled={loading}
              aria-label={
                isSaved ? 'Видалити зі збережених' : 'Зберегти історію'
              }
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
          )}
        </div>
      </div>
    </div>
  );
}
