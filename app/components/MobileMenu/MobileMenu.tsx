'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      <div className={css.menuHeader}>
        <Link href="/" className={css.menuLogo} onClick={onClose}>
          <Image
            src="/Header/logo-dark.svg"
            alt="logo"
            width={148}
            height={22}
          />
        </Link>

        <button className={css.closeBtn} onClick={onClose}>
          <Image src="/Header/close.svg" alt="close" width={24} height={24} />
        </button>
      </div>

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
          <UserNav
            user={user}
            onLogout={onLogout}
            setLogoutModalOpen={setLogoutModalOpen}
            variant="mobile"
            onClose={onClose}
          />
        ) : (
          <AuthButtons variant="mobile" onClick={onClose} />
        )}
      </ul>
    </nav>
  );
}
