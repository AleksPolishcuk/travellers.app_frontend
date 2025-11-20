'use client'

import { useState, useEffect } from 'react';
import styles from './TravellerInfo.module.css';
import { getUserById } from '@/lib/api/clientApi';

interface TravellerInfoProps {
    userId: string;
}

const  TravellerInfo = ({userId}: TravellerInfoProps) => {
    
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      const loadUser = async () => {
        const response = await getUserById(userId);
        setUser(response?.data ?? response);
      };
  
      loadUser();
    }, [userId]);
  
    if (!user) return <div>Завантаження...</div>;
    
    return (
        <section className={styles.travellerInfo}>
            <div>
            <div className={styles.infoTravellerContainer}>
        <div className={styles.imageContainer}>
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className={styles.imageTraveller}
            width={199}
            height={199}
          />
        </div>
        <div className={styles.textsContainer}>
          <div className={styles.nameContainer}>
            <h3 className="textTraveller">{user.name}</h3>
          </div>
          <div className="descContainer">
            <p className="textDesc">{user.description}</p>
          </div>
        </div>
      </div>
            </div>
        </section>
    )
}

export default TravellerInfo;