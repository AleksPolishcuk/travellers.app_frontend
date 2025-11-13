'use client';

import Link from 'next/link';
import Image from 'next/image';
import css from '../MobileMenu/MobileMenu.module.css';

interface User {
  name: string;
  avatar?: string;
}

interface UserNavProps {
  user: User;
  onLogout: () => void;
  setLogoutModalOpen: (value: boolean) => void;
  variant?: 'desktop' | 'mobile';
  onClose?: () => void;
}

export default function UserNav({
  user,
  onLogout,
  setLogoutModalOpen,
  variant = 'desktop',
  onClose,
}: UserNavProps) {
  return (
    <ul className={variant === 'desktop' ? css.desktopUserNav : css.mobNavList}>
      <li>
        <Link href="/profile" onClick={onClose}>
          Мій профіль
        </Link>
      </li>

      <li>
        <Link href="/create-story" onClick={onClose}>
          <button className={css.publishBtn}>Опублікувати історію</button>
        </Link>
      </li>

      <li className={css.userRow}>
        <Link href="/profile" onClick={onClose}>
          <Image
            src={user.avatar || '/avatar.png'}
            alt={user.name}
            width={32}
            height={32}
          />
          <span>{user.name}</span>
        </Link>

        <button
          onClick={() => {
            setLogoutModalOpen(true);
            onClose?.();
          }}
        >
          <Image
            src="/icons.svg/icon-logout.svg"
            alt="Вихід"
            width={24}
            height={24}
          />
        </button>
      </li>
    </ul>
  );
}
