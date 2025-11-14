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
        <Link
          href="/stories/create"
          onClick={onClose}
          className={css.publishBtn}
        >
          Опублікувати історію
        </Link>
      </li>
      <li className={css.userRow}>
        <Link className={css.userRowRow} href="/profile" onClick={onClose}>
          <img
            src={user.avatar ? user.avatar : '/Avatar.svg'}
            alt=""
            width={24}
            height={24}
          />
          <span className="userName">{user.name}</span>
        </Link>

        <span className={css.divider}></span>

        <button
          className={css.headerLogoutButton}
          onClick={() => {
            setLogoutModalOpen(true);
            onClose?.();
          }}
        >
          <svg
            className={css.headerLogout}
            width="24"
            height="24"
            aria-label="Logout"
          >
            <use href="/icons.svg#icon-logout"></use>
          </svg>
        </button>
      </li>
    </ul>
  );
}
