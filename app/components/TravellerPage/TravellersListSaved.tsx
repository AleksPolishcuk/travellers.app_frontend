'use client';

import { useState, useEffect, useRef } from 'react';
import { getTravellerById } from '@/lib/api/travellerload';
import styles from './TravellerCard.module.css';
import { useScreenSize } from '@/lib/hooks/useScreenSize';
import { TravellerStoryCard } from './TravellerStoryCard';
import { Story } from '@/types/story';
import Loader from '@/app/components/Loader/Loader';
import { useRouter } from 'next/navigation';

interface TravellerStoriesProps {
  travellerId: string;
}

const TravellerStories = ({ travellerId }: TravellerStoriesProps) => {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [buffer, setBuffer] = useState<Story[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLButtonElement | null>(null);

  const width = useScreenSize();
  const perPage = width > 1024 ? 9 : width > 768 ? 8 : 9;

  useEffect(() => {
    const fetchStories = async () => {
      if (!travellerId) return;
      try {
        setLoading(true);
        const response = await getTravellerById(travellerId);
        const list = response?.data?.stories ?? [];
        const user = response?.data?.user;

        if (Array.isArray(list)) {
          const storiesWithOwner = list.map((story) => ({
            ...story,
            ownerId: user,
          }));

          setStories(storiesWithOwner.slice(0, perPage));
          setBuffer(storiesWithOwner.slice(perPage));
        } else {
          console.warn('Unexpected response structure:', response);
          setStories([]);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch stories',
        );
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [travellerId, perPage]);

  const renderFromBuffer = () => {
    const toRender = buffer.slice(0, perPage);
    setStories((prev) => [...prev, ...toRender]);
    setBuffer((prev) => prev.slice(perPage));
  };

  const fetchMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setIsFetching(true);

    try {
      const response = await getTravellerById(travellerId);
      const list = response?.data?.stories ?? [];

      setBuffer((prev) => [...prev, ...list]);

      if (list.length < perPage) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more stories', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (buffer.length >= perPage && !isFetching) {
      renderFromBuffer();
    }
  }, [buffer, isFetching]);

  const handleLoadMore = () => {
    loadMoreRef.current?.blur();
    if (buffer.length >= perPage) {
      renderFromBuffer();
    } else if (!isFetching) {
      fetchMore();
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!stories || stories.length === 0) {
    return (
      <div className={styles.messageContainerNotFound}>
        <div className="textMessageContainer">
          <h4 className={styles.textNotFoundMessage}>
            Цей користувач ще не публікував історій
          </h4>
        </div>
        <div className={styles.buttonMessageContainer}>
          <button
            className={styles.buttonNotFound}
            onClick={() => {
              router.push('/travellers');
            }}
          >
            Назад до історій
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.stories}>
      <div className={styles.story}>
        <ul className={styles.list}>
          {Array.isArray(stories) &&
            stories.map((story) => (
              <li key={story._id}>
                <TravellerStoryCard story={story} />
              </li>
            ))}
        </ul>

        <div className={styles.readBtn}>
          {isFetching ? (
            <Loader />
          ) : hasMore ? (
            <button
              className={styles.readButton}
              ref={loadMoreRef}
              onClick={handleLoadMore}
            >
              Показати ще
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default TravellerStories;
