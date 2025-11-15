import Link from 'next/link';
import Image from 'next/image';
import css from './UserNav.module.css';

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
  iconColor?: string;
  buttonVariant?: 'white' | 'blue';
  textColor?: string;
}

export default function UserNav({
  user,
  setLogoutModalOpen,
  variant = 'desktop',
  onClose,
  iconColor = '#000',
  buttonVariant = 'blue',
  textColor = '#000',
}: UserNavProps) {
  return (
    <ul
      className={variant === 'desktop' ? css.desktopUserNav : css.mobileUserNav}
    >
      <li>
        <Link href="/profile" onClick={onClose} style={{ color: textColor }}>
          Мій профіль
        </Link>
      </li>
      <li>
        <Link
          href="/stories"
          onClick={onClose}
          className={`${css.publishBtn} ${
            buttonVariant === 'white' ? css.publishWhite : css.publishBlue
          }`}
        >
          Опублікувати історію
        </Link>
      </li>
      <li className={css.userRow}>
        <Link
          className={css.userRowRow}
          style={{ color: textColor }}
          href="/profile"
          onClick={onClose}
        >
          <Image
            src={user.avatar || '/Avatar.svg'}
            alt={user.name}
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
            style={{ color: iconColor }}
          >
            <use href="/icons.svg#icon-logout"></use>
          </svg>
        </button>
      </li>
    </ul>
  );
}
