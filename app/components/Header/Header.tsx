'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import css from './Header.module.css';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import AuthButtons from '../AuthButtons/AuthButtons';
import MobileMenu from '../MobileMenu/MobileMenu';
import UserNav from '../UserNav/UserNav';

interface User {
  name: string;
  avatar?: string;
}

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    console.log('User logged out');
    setLogoutModalOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={css.headerSection}>
      <div className={css.headerContainer}>
        <div className={css.headerLogoWrapper}>
          <svg
            className={css.headerLogo}
            width="30"
            height="30"
            aria-label="Logo"
          >
            <use href="/icons.svg#icon-company-logo"></use>
          </svg>
          <span className={css.logoText}>Подорожники</span>
        </div>

        <nav className={css.headerNav}>
          <ul className={css.headerNavList}>
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li>
              <Link href="/stories">Історії</Link>
            </li>
            <li>
              <Link href="/travellers">Мандрівники</Link>
            </li>

            <nav className={css.headerNav}>
              {user ? (
                <UserNav
                  user={user}
                  onLogout={handleLogout}
                  setLogoutModalOpen={setLogoutModalOpen}
                  variant="desktop"
                />
              ) : (
                <AuthButtons variant="desktop" />
              )}
            </nav>
          </ul>
        </nav>

        <button className={css.burgerBtn} onClick={toggleMenu}>
          <svg
            className={css.headerLogo}
            width="24"
            height="24"
            aria-label="Logo"
          >
            <use href="/icons.svg#icon-menu"></use>
          </svg>
        </button>
      </div>
      <MobileMenu
        user={user}
        isOpen={menuOpen}
        onClose={toggleMenu}
        onLogout={handleLogout}
        setLogoutModalOpen={setLogoutModalOpen}
      />

      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
}
