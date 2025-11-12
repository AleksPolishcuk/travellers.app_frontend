'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTravellers, Traveller } from '@/lib/api/clientApi';
import TravellerCard from '@/app/components/TravellerCard/TravellerCard';
import styles from '@/app/Home.module.css';

const INITIAL_DISPLAY_COUNT = 4;
const LOAD_MORE_STEP = 3;
const ALL_TRAVELLERS_LIMIT = 20;

const OurTravellersSection = () => {
  const [allTravellers, setAllTravellers] = useState<Traveller[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + LOAD_MORE_STEP);
  };

  const travellersToDisplay = allTravellers.slice(0, visibleCount);
  const allLoaded = visibleCount >= allTravellers.length;

  if (isLoading) {
    return <p>Завантаження мандрівників...</p>;
  }

  if (allTravellers.length === 0) {
    return null;
  }

  return (
    <section className={styles.ourTravellersSection}>
      <h2 className={styles.sectionTitle}>Наші Мандрівники</h2>

      <ul className={`${styles.travellersGrid} ${styles.grid4}`}>
        {travellersToDisplay.map((traveller) => (
          <TravellerCard key={traveller._id} traveller={traveller} />
        ))}
      </ul>

      {!allLoaded && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={handleLoadMore}
            className={styles.loadMoreButton}
            disabled={isLoading}
          >
            Переглянути всіх
          </button>
        </div>
      )}

      {/* Додано кнопку "Переглянути всіх" (якщо вже всі завантажені) 
            для переходу на сторінку /travellers */}
      {allLoaded && (
        <div className={styles.loadMoreContainer}>
          <Link href="/travellers" passHref>
            <button className={styles.loadMoreButton}>
              Перейти на сторінку Мандрівники
            </button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default OurTravellersSection;
