'use client';

import Image from 'next/image';
import styles from '@/app/profile/Profile.module.css';
import type { User } from '@/types/user';

export default function TravellerInfo({ user }: { user: User }) {
  return (
    <section className={styles.header} aria-label="traveller info">
      <div className={styles.headerLeft}>
        <div className={styles.avatarWrap}>
          <Image
            src={user.avatarUrl || '/Avatar-Image@2x.jpg'}
            alt={`Фото ${user.name}`}
            width={168}
            height={168}
            className={styles.avatar}
            priority
          />
        </div>

        <div className={styles.meta}>
          <h1 className={styles.userName}>{user.name}</h1>
          {user.description ? (
            <p className={styles.userBio}>{user.description}</p>
          ) : (
            <p className={styles.userBioEmpty} />
          )}
        </div>
      </div>
    </section>
  );
}
