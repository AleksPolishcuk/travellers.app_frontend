'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import css from './Header.module.css';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import AuthButtons from '../AuthButtons/AuthButtons';
import MobileMenu from '../MobileMenu/MobileMenu';
import UserNav from '../UserNav/UserNav';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    useAuthStore.getState().clearUser();
    setLogoutModalOpen(false);
  };

  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={isAuthPage ? css.authHeader : css.headerSection}>
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

        {/* 🔹 Кнопка "Опублікувати історію" — только на планшете */}
        {user && (
          <div className={css.publishTabletOnly}>
            <Link href="/create-story">
              <button className={css.publishBtn}>Опублікувати історію</button>
            </Link>
          </div>
        )}

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

            {/* Десктопна навігація для авторизованих */}
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
