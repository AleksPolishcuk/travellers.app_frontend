'use client';

import { useEffect, useState, useCallback } from 'react';
import { getTravellers } from '@/lib/api/clientApi';
import { Traveller } from '@/types/user';
import TravellerCard from '@/app/components/TravellerCard/TravellerCard';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import styles from './Travellers.module.css';
import Loading from '@/app/loading';

const LIMIT_DESKTOP = 12;
const LIMIT_MOBILE_TABLET = 8;
const LOAD_MORE_STEP = 4;

const DESKTOP_MEDIA = '(min-width: 1440px)';

export default function TravellersPage() {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA);

  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialLimit = isDesktop ? LIMIT_DESKTOP : LIMIT_MOBILE_TABLET;

  const fetchTravellers = useCallback(
    async (pageNumber: number, limit: number, replace: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getTravellers(pageNumber, limit);

        setTravellers((prev) => {
          const list = replace
            ? data.travellers
            : [...prev, ...data.travellers];

          return Array.from(new Map(list.map((t) => [t._id, t])).values());
        });

        setHasMore(data.hasNextPage);

        if (replace) {
          const initialPage = Math.ceil(initialLimit / LOAD_MORE_STEP);
          setPage(initialPage);
        }
      } catch (err) {
        console.error('Помилка API:', err);
        setError('Не вдалося завантажити дані.');
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [initialLimit],
  );

  useEffect(() => {
    fetchTravellers(1, initialLimit, true);
  }, [initialLimit, fetchTravellers]);

  const handleLoadMore = async () => {
    if (!hasMore || isLoading) return;

    const nextPage = page + 1;

    const previousCount = travellers.length;

    await fetchTravellers(nextPage, LOAD_MORE_STEP, false);
    setPage(nextPage);

    setTimeout(() => {
      const cards = document.querySelectorAll<HTMLLIElement>(
        `.${styles.travellersGrid} > li`,
      );
      if (cards.length > previousCount) {
        cards[previousCount].scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className={styles.travellersPageWrapper}>
      <div className="container">
        <h1 className={styles.pageTitle}>Мандрівники</h1>

        {error && <p className={styles.errorText}>{error}</p>}

        {isLoading && travellers.length === 0 && <Loading />}

        {travellers.length > 0 && (
          <ul className={styles.travellersGrid}>
            {travellers.map((t) => (
              <TravellerCard key={t._id} traveller={t} />
            ))}
          </ul>
        )}

        {hasMore && travellers.length > 0 && (
          <div className={styles.loadMoreContainer}>
            <button
              className={styles.loadMoreButton}
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Завантаження...' : 'Показати ще'}
            </button>
          </div>
        )}

        {!hasMore && travellers.length > 0 && (
          <div className={styles.loadMoreContainer}>
            <p className={styles.noMoreTravellers}>
              Список мандрівників вичерпано.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
