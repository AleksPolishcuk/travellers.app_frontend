import Link from 'next/link';
import Image from 'next/image';
import { Traveller } from '@/types/user';
import styles from './TravellerCard.module.css';

interface TravellerCardProps {
  traveller: Traveller;
}

export default function TravellerCard({ traveller }: TravellerCardProps) {
  const shortDescription = traveller.description
    ? traveller.description.substring(0, 100) +
      (traveller.description.length > 100 ? '...' : '')
    : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.'; // ✅ ВИПРАВЛЕНО: Використовуємо avatarUrl замість avatar

  const avatarSrc = traveller.avatarUrl || '/images/default-avatar.png';

  return (
    <li className={styles.card}>
      <div className={styles.photoWrapper}>
        <Image
          src={avatarSrc}
          alt={traveller.name}
          width={112} // ✅ Оновлено згідно з фінальними стилями (112px)
          height={112} // ✅ Оновлено згідно з фінальними стилями (112px)
          className={styles.photo}
        />
      </div>
      <h3 className={styles.name}>{traveller.name}</h3>
      <p className={styles.description}>{shortDescription}</p>
      <Link href={`/profile/${traveller._id}`} passHref>
        <button className={styles.button}>Переглянути профіль</button>
      </Link>
    </li>
  );
}
