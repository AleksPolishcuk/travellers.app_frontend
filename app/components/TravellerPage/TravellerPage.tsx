'use client';

import { useState, useEffect } from 'react';
import css from './TravellerPage.module.css';
import TravellerStories from './TravellersListSaved';
import { getTravellerById } from '@/lib/api/travellerload';

interface TravellerStoriesProps {
  travellerId: string;
}

export default function TravellerComponent({
  travellerId,
}: TravellerStoriesProps) {
  const [traveller, setTraveller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTraveller() {
      try {
        const response = await getTravellerById(travellerId);
        setTraveller(response.data.user);
      } catch (err) {
        console.error('Ошибка загрузки юзера:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTraveller();
  }, [travellerId]);

  if (loading) return <p>Loading...</p>;
  if (!traveller) return <p>User not found</p>;

  console.log('traveller', traveller);
  

  return (
    <>
      <div className={css.infoTravellerContainer}>
        <div className={css.imageContainer}>
          <img
            src={traveller.avatarUrl}
            alt="Avatar"
            className={css.imageTraveller}
            width={199}
            height={199}
          />
        </div>
        <div className={css.textsContainer}>
          <div className={css.nameContainer}>
            <h3 className="textTraveller">{traveller.name}</h3>
          </div>
          <div className="descContainer">
            <p className="textDesc">{traveller.description}</p>
          </div>
        </div>
      </div>
      <div className={css.storiesContainer}>
        <div className={css.titleContainer}>
          <h2 className={css.textTitle}>Історії Мандрівника</h2>
        </div>
        <div className="storiesListContainer">
          <TravellerStories travellerId={travellerId} />
        </div>
      </div>
    </>
  );
}
