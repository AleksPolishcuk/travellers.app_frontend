'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getTravellers } from '@/lib/api/clientApi';
import { Traveller } from '@/types/user';
import TravellerCard from '@/app/components/TravellerCard/TravellerCard';
import styles from './OurTravellersSection.module.css';

const INITIAL_DISPLAY_COUNT = 4;
const LOAD_MORE_STEP = 4;
const ALL_TRAVELLERS_LIMIT = 20;

const OurTravellersSection = () => {
  const [allTravellers, setAllTravellers] = useState<Traveller[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isLoading, setIsLoading] = useState(true);

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getTravellers(1, ALL_TRAVELLERS_LIMIT);
        setAllTravellers(data.travellers);
      } catch (error) {
        console.error('Failed to fetch travellers for home page:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    const previousCount = visibleCount;
    const newCount = visibleCount + LOAD_MORE_STEP;

    setVisibleCount(newCount);

    (e.currentTarget as HTMLButtonElement).blur();

    setTimeout(() => {
      if (!listRef.current) return;

      const list = listRef.current;
      const newElement = list.children[previousCount];
      if (!newElement) return;

      newElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const travellersToDisplay = allTravellers.slice(0, visibleCount);
  const allLoaded = visibleCount >= allTravellers.length;

  if (isLoading) return <p>Завантаження мандрівників...</p>;
  if (allTravellers.length === 0) return null;

  return (
    <section className={styles.ourTravellersSection}>
      <h2 className={styles.sectionTitle}>Наші Мандрівники</h2>

      <ul className={styles.travellersGrid} ref={listRef}>
        {travellersToDisplay.map((traveller) => (
          <TravellerCard key={traveller._id} traveller={traveller} />
        ))}
      </ul>

      <div className={styles.loadMoreContainer}>
        {!allLoaded && (
          <button
            onClick={handleLoadMore}
            className={styles.loadMoreButton}
            disabled={isLoading}
          >
            Показати ще
          </button>
        )}

        {allLoaded && (
          <Link href="/travellers" passHref>
            <button className={styles.loadMoreButton}>
              Перейти на сторінку Мандрівники
            </button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default OurTravellersSection;
