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
  headerVariant?: 'transparent' | 'white';
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
  headerVariant = 'white',
}: UserNavProps) {
  return (
    <ul
      className={variant === 'desktop' ? css.desktopUserNav : css.mobileUserNav}
    >
      <li>
        <Link
          href="/profile"
          onClick={onClose}
          className={`${css.profileLink} ${
            headerVariant === 'transparent'
              ? css.profileLinkTransparent
              : css.profileLinkWhite
          }`}
          style={{ color: textColor }}
        >
          Мій профіль
        </Link>
      </li>
      <li>
        <Link
          href="/stories/create"
          onClick={onClose}
          className={`${css.publishBtn} ${
            buttonVariant === 'white' ? css.publishWhite : css.publishBlue
          }`}
        >
          Опублікувати історію
        </Link>
      </li>
      <li className={css.userBlock}>
        <ul className={css.userInline}>
          <li className={css.userRowItem}>
            <div className={css.userRowRow} style={{ color: textColor }}>
              <Image
                src={user.avatar || '/Avatar.svg'}
                alt={user.name}
                width={24}
                height={24}
              />
              <span className="userName">{user.name}</span>
            </div>
          </li>

          <li className={css.dividerLi}>
            <span className={css.divider}></span>
          </li>

          <li className={css.logoutLi}>
            <button
              className={css.headerLogoutButton}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setLogoutModalOpen(true);
                onClose?.();
              }}
            >
              <svg width="24" height="24" style={{ color: iconColor }}>
                <use href="/icons.svg#icon-logout" />
              </svg>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  );
}
