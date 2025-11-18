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
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1339) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const transparentPages = ['/'];
  const whitePages = ['/travellers', '/stories', '/stories/create', '/profile'];

  let headerClass = css.headerWhite;
  if (pathname.startsWith('/auth')) {
    headerClass = css.authHeader;
  } else if (transparentPages.some((p) => pathname === p)) {
    headerClass = css.headerTransparent;
  } else if (whitePages.some((p) => pathname.startsWith(p))) {
    headerClass = css.headerWhite;
  }

  const headerVariant =
    headerClass === css.headerTransparent ? 'transparent' : 'white';
  const headerColor = headerClass === css.headerTransparent ? '#fff' : '#000';

  return (
    <header className={`${css.header} ${headerClass}`}>
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

        {user && (
          <div className={css.publishTabletOnly}>
            <Link href="/create-story">
              <button
                className={`${css.publishBtn} ${
                  headerVariant === 'transparent'
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
              <Link
                href="/"
                className={`${css.navLink} ${
                  headerVariant === 'transparent'
                    ? css.navLink_transparent
                    : css.navLink_white
                }`}
              >
                Головна
              </Link>
            </li>
            <li>
              <Link
                href="/stories"
                className={`${css.navLink} ${
                  headerVariant === 'transparent'
                    ? css.navLink_transparent
                    : css.navLink_white
                }`}
              >
                Історії
              </Link>
            </li>
            <li>
              <Link
                href="/travellers"
                className={`${css.navLink} ${
                  headerVariant === 'transparent'
                    ? css.navLink_transparent
                    : css.navLink_white
                }`}
              >
                Мандрівники
              </Link>
            </li>
          </ul>

          {/* Навігація для авторизованих */}
          {user && (
            <div className={css.headerNavAuth}>
              <UserNav
                user={user}
                onLogout={handleLogout}
                setLogoutModalOpen={setLogoutModalOpen}
                iconColor={headerColor}
                buttonVariant={
                  headerVariant === 'transparent' ? 'white' : 'blue'
                }
                headerVariant={headerVariant}
                textColor={
                  headerClass === css.headerTransparent ? '#fff' : '#000'
                }
              />
            </div>
          )}

          {/* Навігація для неавторизованих */}
          {!user && (
            <div className={css.authButtonsWrapper}>
              <AuthButtons variant="desktop" headerVariant={headerVariant} />
            </div>
          )}
        </nav>

        <button className={css.burgerBtn} onClick={toggleMenu}>
          <svg
            className={css.headerLogo}
            width="24"
            height="24"
            aria-label="Menu"
            style={{
              color: headerClass === css.headerTransparent ? '#fff' : '#000',
            }}
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
