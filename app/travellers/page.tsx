// app/travellers/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getTravellers, Traveller } from '@/lib/api/clientApi';
import TravellerCard from '@/app/components/TravellerCard/TravellerCard';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import styles from '@/app/Home.module.css';
import Loading from '@/app/loading';

// Константи пагінації
const DESKTOP_INITIAL_LIMIT = 12; // Desktop
const MOBILE_TABLET_INITIAL_LIMIT = 8; // Tablet/Mobile
const LOAD_STEP = 4; // Додаткове підвантаження по 4 картки
const DESKTOP_QUERY = '(min-width: 1440px)';

export default function TravellersPage() {
  // Визначаємо адаптивний стан
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Адаптивне визначення початкового ліміту
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

          // Дедуплікація за унікальним ID
          const uniqueTravellers = Array.from(
            new Map(newTravellers.map((t) => [t._id, t])).values(),
          );
          return uniqueTravellers;
        });

        // 🛑 ВИПРАВЛЕНО: Коригування стану 'page' після завантаження
        if (isInitial) {
          // Встановлюємо page на ефективну кількість сторінок, вже завантажених кроком LOAD_STEP (4)
          const effectivePageCount = Math.ceil(initialLimit / LOAD_STEP);
          setPage(effectivePageCount);
        } else {
          // Для подальших кліків просто збільшуємо лічильник
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
    [initialLimit], // ✅ ДОДАНО initialLimit у залежності для коректного виконання isInitial
  );

  // Ефект для першого завантаження (з адаптивним лімітом)
  useEffect(() => {
    if (initialLimit > 0) {
      setTravellers([]);
      // Початковий запит робиться з великим лімітом (12 або 8)
      fetchTravellers(1, initialLimit, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLimit]);

  const handleLoadMore = () => {
    if (!hasMore || isLoading) return;

    // nextPage тепер є коректним числом (наприклад, 3 або 4)
    const nextPage = page + 1;

    // Завжди запитуємо наступну сторінку з лімітом 4
    fetchTravellers(nextPage, LOAD_STEP, false);
  };

  // Визначення класу сітки
  const gridClass = isDesktop ? styles.grid4 : styles.travellersGrid;

  return (
    <div>
      <h1
        className={styles.sectionTitle}
        style={{ marginTop: '72px', textAlign: 'center' }}
      >
        Мандрівники
      </h1>

      {error && <p className={styles.errorText}>{error}</p>}

      {isLoading && travellers.length === 0 && <Loading />}

      {travellers.length > 0 && (
        <ul
          className={`${styles.travellersGrid} ${gridClass}`}
          // 🛑 ВИПРАВЛЕНО: Відступ після карток 24px
          style={{ marginBottom: '24px' }}
        >
          {travellers.map((traveller) => (
            <TravellerCard key={traveller._id} traveller={traveller} />
          ))}
        </ul>
      )}

      {/* Кнопка "Показати ще" */}
      {hasMore && (
        <div
          className={styles.loadMoreContainer}
          // 🛑 ВИПРАВЛЕНО: Відступ до футера 72px
          style={{ marginBottom: '72px' }}
        >
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className={styles.loadMoreButton}
          >
            {isLoading ? 'Завантаження...' : 'Показати ще'}
          </button>
        </div>
      )}
      {!hasMore && travellers.length > 0 && !isLoading && (
        <div
          className={styles.loadMoreContainer}
          // 🛑 ВИПРАВЛЕНО: Відступ до футера 72px
          style={{ marginBottom: '72px' }}
        >
          <p className={styles.noMoreTravellers}>
            Список мандрівників вичерпано.
          </p>
        </div>
      )}
    </div>
  );
}
