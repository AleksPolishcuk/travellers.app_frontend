'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import css from './Header.module.css';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
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

  const transparentPages = ['/'];
  const whitePages = [
    '/travellers',
    '/travellers/',
    '/stories',
    '/stories/create',
    '/stories/',
    '/stories/',
    '/profile',
  ];

  let headerClass = css.headerWhite;

  if (pathname.startsWith('/auth')) {
    headerClass = css.authHeader;
  } else if (transparentPages.some((p) => pathname === p)) {
    headerClass = css.headerTransparent;
  } else if (whitePages.some((p) => pathname.startsWith(p))) {
    headerClass = css.headerWhite;
  }

  const headerColor = headerClass === css.headerTransparent ? '#fff' : '#000';
  const headerHoverColor =
    headerClass === css.headerTransparent ? '#e8eeff' : '#4169e1';

  return (
    <header className={headerClass}>
      <div className={css.headerContainer}>
        <Link href="/" className={css.headerLogoWrapper}>
          <svg
            className={css.headerLogo}
            width="30"
            height="30"
            aria-label="Logo"
          >
            <use href="/icons.svg#icon-company-logo"></use>
          </svg>
          <span className={css.logoText}>Подорожники</span>
        </Link>
        {/*  Кнопка "Опублікувати історію" — только на планшете */}
        {user && (
          <div className={css.publishTabletOnly}>
            <Link href="/create-story">
              <button
                className={`${css.publishBtn} ${
                  headerClass === css.headerTransparent
                    ? css.publishWhite
                    : css.publishBlue
                }`}
              >
                Опублікувати історію
              </button>
            </Link>
          </div>
        )}

        <nav className={css.headerNav}>
          <ul className={css.headerNavList}>
            <li>
              <Link href="/" style={{ color: headerColor }}>
                Головна
              </Link>
            </li>
            <li>
              <Link href="/stories" style={{ color: headerColor }}>
                Історії
              </Link>
            </li>
            <li>
              <Link href="/travellers" style={{ color: headerColor }}>
                Мандрівники
              </Link>
            </li>

            {/* Десктопна навігація для авторизованих */}
            <nav className={css.headerNav}>
              {user ? (
                <UserNav
                  user={user}
                  onLogout={handleLogout}
                  setLogoutModalOpen={setLogoutModalOpen}
                  iconColor={
                    headerClass === css.headerTransparent ? '#fff' : '#000'
                  }
                  buttonVariant={
                    headerClass === css.headerTransparent ? 'white' : 'blue'
                  }
                  textColor={headerColor}
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

      <ConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Ви точно хочете вийти?"
        message="Ми будемо сумувати за вами!"
        confirmButtonText="Вийти"
        cancelButtonText="Скасувати"
        onConfirm={handleLogout}
      />
    </header>
  );
}
