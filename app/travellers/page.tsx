'use client';

import { useEffect, useState, useCallback } from 'react';
import { getTravellers } from '@/lib/api/clientApi';
import { Traveller } from '@/types/user';
import TravellerCard from '@/app/components/TravellerCard/TravellerCard';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import homeStyles from '@/app/Home.module.css'; // Загальні стилі (для кнопки та error)
import styles from './Travellers.module.css'; // <-- Специфічні стилі сторінки
import Loading from '@/app/loading';

const DESKTOP_INITIAL_LIMIT = 12;
const MOBILE_TABLET_INITIAL_LIMIT = 8;
const LOAD_STEP = 4;
const DESKTOP_QUERY = '(min-width: 1440px)';

export default function TravellersPage() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const initialLimit = isDesktop
    ? DESKTOP_INITIAL_LIMIT
    : MOBILE_TABLET_INITIAL_LIMIT;

  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTravellers = useCallback(
    async (currentPage: number, limit: number, isInitial: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTravellers(currentPage, limit);

        setTravellers((prev) => {
          const newTravellers = isInitial
            ? data.travellers
            : [...prev, ...data.travellers];

          const uniqueTravellers = Array.from(
            new Map(newTravellers.map((t) => [t._id, t])).values(),
          );
          return uniqueTravellers;
        });

        if (isInitial) {
          const effectivePageCount = Math.ceil(initialLimit / LOAD_STEP);
          setPage(effectivePageCount);
        } else {
          setPage((prev) => prev + 1);
        }

        setHasMore(data.hasNextPage);
      } catch (err) {
        console.error('Failed to fetch travellers:', err);
        setError('Помилка завантаження мандрівників.');
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [initialLimit],
  );

  useEffect(() => {
    if (initialLimit > 0) {
      setTravellers([]);
      fetchTravellers(1, initialLimit, true);
    }
  }, [initialLimit]);

  const handleLoadMore = () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    fetchTravellers(nextPage, LOAD_STEP, false);
  };

  // ❌ gridClass більше не потрібен, оскільки вся логіка в styles.travellersGrid
  // const gridClass = isDesktop ? homeStyles.grid4 : homeStyles.travellersGrid;

  return (
    <div className={styles.travellersPageWrapper}>
      <div className="container">
        {/* Заголовок: Центрування та відступ 72px */}
        <h1 className={`${styles.sectionTitle} ${styles.centeredTitle}`}>
          Мандрівники
        </h1>

        {error && <p className={homeStyles.errorText}>{error}</p>}

        {isLoading && travellers.length === 0 && <Loading />}

        {travellers.length > 0 && (
          <ul
            // ✅ ВИКОРИСТОВУЄМО ТІЛЬКИ ЛОКАЛЬНІ КЛАСИ
            className={`${styles.travellersGrid}`}
          >
            {travellers.map((traveller) => (
              <TravellerCard key={traveller._id} traveller={traveller} />
            ))}
          </ul>
        )}

        {/* Кнопка "Показати ще" */}
        {hasMore && (
          <div
            className={`${styles.loadMoreContainer} ${styles.buttonToFooterMargin}`}
          >
            <button
              className={homeStyles.loadMoreButton} // Використовуємо загальний стиль кнопки
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Завантаження...' : 'Показати ще'}
            </button>
          </div>
        )}
        {/* Повідомлення про вичерпання */}
        {!hasMore && travellers.length > 0 && !isLoading && (
          <div
            className={`${styles.loadMoreContainer} ${styles.buttonToFooterMargin}`}
          >
            <p className={styles.noMoreTravellers}>
              Список мандрівників вичерпано.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
