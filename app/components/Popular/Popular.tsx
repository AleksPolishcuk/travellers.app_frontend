'use client';

import { useState, useEffect, useRef } from 'react';
import { getStories } from '@/lib/api/clientApi';
import styles from './Popular.module.css';
import { useScreenSize } from '../../../lib/hooks/useScreenSize';
import { StoryCard } from '../StoryCard/StoryCard';
import { Story } from '../../../types/story';

const Popular = () => {
  const [stories, setStories] = useState<Story[]>([]);

  const [buffer, setBuffer] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLButtonElement | null>(null);

  const width = useScreenSize();
  const perPage = width > 1024 ? 3 : width > 768 ? 4 : 3;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await getStories(1, perPage);
        console.log('Full API response:', response);

        // ДОСТУП ДО ДАНИХ
        if (response && response.data && Array.isArray(response.data.data)) {
          console.log('Stories found:', response.data.data);
          setStories(response.data.data.slice(0, perPage));
          setBuffer(response.data.data.slice(perPage));
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
  }, [perPage]);

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
      const response = await getStories(nextPage, perPage);
      const list = response?.data?.data ?? [];

      setBuffer((prev) => [...prev, ...list]);

      if (list.length < perPage) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
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

  if (loading)
    return <div className={styles.loading}>Завантаження історій...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!stories || stories.length === 0)
    return <div className={styles.empty}>Історії відсутні</div>;

  return (
    <div className={styles.storyPopular}>
      <h2 className={styles.storyTitle}>Популярні історії</h2>
      <ul className={styles.list}>
        {Array.isArray(stories) &&
          stories.map((story) => <StoryCard key={story._id} story={story} />)}
      </ul>
      <div className={styles.readBtn}>
        {hasMore && (
          <button
            className={styles.readButton}
            ref={loadMoreRef}
            onClick={handleLoadMore}
            disabled={isFetching}
          >
            {isFetching ? 'loader...' : 'Переглянути всі'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Popular;
