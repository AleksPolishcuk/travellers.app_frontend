'use client';

import Link from 'next/link';
import AuthButtons from '../AuthButtons/AuthButtons';
import css from './MobileMenu.module.css';
import UserNav from '../UserNav/UserNav';

interface User {
  name: string;
  avatar?: string;
}

interface MobileMenuProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  setLogoutModalOpen: (value: boolean) => void;
}

export default function MobileMenu({
  user,
  isOpen,
  onClose,
  onLogout,
  setLogoutModalOpen,
}: MobileMenuProps) {
  return (
    <nav className={`${css.headerMenu} ${isOpen ? css.open : ''}`}>
      {/* Хедер */}
      <div className={css.menuHeader}>
        <Link href="/" className={css.menuLogo} onClick={onClose}>
          <svg width="30" height="30" className={css.logoIcon}>
            <use href="/icons.svg#icon-company-logo" />
          </svg>
          <span className={css.logoText}>Подорожники</span>
        </Link>

        <button className={css.closeBtn} onClick={onClose}>
          <svg width="24" height="24" aria-label="close">
            <use href="/icons.svg#icon-close"></use>
          </svg>
        </button>
      </div>

      {/* Меню */}
      <div className={css.mobMenu}>
        <ul className={css.mobNavList}>
          <li>
            <Link href="/" onClick={onClose}>
              Головна
            </Link>
          </li>
          <li>
            <Link href="/stories" onClick={onClose}>
              Історії
            </Link>
          </li>
          <li>
            <Link href="/travellers" onClick={onClose}>
              Мандрівники
            </Link>
          </li>

          {user ? (
            <li className={css.userNavBlock}>
              <UserNav
                user={user}
                onLogout={onLogout}
                setLogoutModalOpen={setLogoutModalOpen}
                variant="mobile"
                onClose={onClose}
              />
            </li>
          ) : (
            <AuthButtons variant="mobile" onClick={onClose} />
          )}
        </ul>
      </div>
    </nav>
  );
}
