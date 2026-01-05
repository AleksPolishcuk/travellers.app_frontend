'use client';

import { useState, useEffect, useRef } from 'react';
import { getStories, getCategories } from '@/lib/api/clientApi';
import styles from './Stories.module.css';
import { useScreenSize } from '../../lib/hooks/useScreenSize';
import { StoryCard } from '../components/StoryCard/StoryCard';
import { Story } from '../../types/story';
import { Category } from '../components/Category/Category';
import { CategoryType } from '@/types/category';
import CategoriesMenu from '../components/CategoriesMenu/CategoriesMenu';
import Loader from '../components/Loader/Loader';

const StoriesPage = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [buffer, setBuffer] = useState<Story[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLButtonElement | null>(null);

  const width = useScreenSize();
  const perPage = width > 1024 ? 9 : width > 768 ? 8 : 9;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const list = response?.data?.data ?? response?.data ?? [];
        setCategories(list);
      } catch (e) {
        console.error('Error fetching categories', e);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1);
        setHasMore(true);

        const response = await getStories(1, perPage, selectedCategoryId);
        const list = response?.data?.data ?? [];

        setStories(list.slice(0, perPage));
        setBuffer(list.slice(perPage));
        setHasMore(list.length > perPage);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch stories',
        );
        setStories([]);
        setBuffer([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [perPage, selectedCategoryId]);

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
      const response = await getStories(nextPage, perPage, selectedCategoryId);
      const list = response?.data?.data ?? [];

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

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    loadMoreRef.current?.blur();
  };

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
  if (!stories || stories.length === 0)
    return <div className={styles.empty}>Історії відсутні</div>;

  return (
    <section className={styles.stories}>
      <div className={styles.story}>
        <h2 className={styles.storyTitle}>Історії Мандрівників</h2>

        <div className={styles.cat}>
          {width > 768 ? (
            <>
              <button
                className={`${styles.allCategories} ${
                  selectedCategoryId === null ? styles.activeAllCategories : ''
                }`}
                onClick={() => handleCategoryClick(null)}
              >
                Всі історії
              </button>

              {categories.map((category) => (
                <Category
                  key={category._id}
                  category={category}
                  active={selectedCategoryId === category._id}
                  onClick={() => handleCategoryClick(category._id)}
                />
              ))}
            </>
          ) : (
            <div className={styles.selectWrap}>
              <p className={styles.selectText}>Категорії</p>

              <CategoriesMenu
                categories={categories}
                selectedCategory={selectedCategoryId}
                onSelectCategory={handleCategoryClick}
              />
            </div>
          )}
        </div>

        <ul className={styles.list}>
          {Array.isArray(stories) &&
            stories.map((story) => (
              <li key={story._id}>
                <StoryCard story={story} />
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

export default StoriesPage;
