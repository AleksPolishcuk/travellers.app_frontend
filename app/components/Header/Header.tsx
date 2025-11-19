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
import { useLogout } from '@/lib/api/clientApi';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  
  const logoutMutation = useLogout();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    console.log('🔄 Header: handleLogout called');
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Header: Logout error:', error);
      setLogoutModalOpen(false);
    }
  };

  useEffect(() => {
    if (logoutMutation.isSuccess) {
      console.log('✅ Header: Logout successful, closing modal');
      setLogoutModalOpen(false);
    }
  }, [logoutMutation.isSuccess]);

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

  const minimalHeaderPages = ['/auth', '/profile'];
  const transparentPages = ['/'];
  const internalPages = ['/stories', '/travellers', '/stories/create'];
  const whitePages = ['/profile'];

  const isMinimalHeader = minimalHeaderPages.some((p) =>
    pathname.startsWith(p),
  );
  const isTransparentHeader = transparentPages.some((p) => pathname === p);
  const isInternalHeader = internalPages.some((p) => pathname.startsWith(p));
  const isWhiteHeader =
    whitePages.some((p) => pathname.startsWith(p)) || isMinimalHeader;

  let headerClass = css.headerInternal;
  if (isTransparentHeader) headerClass = css.headerTransparent;
  if (isWhiteHeader) headerClass = css.headerWhite;

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
            aria-label="Logo">
            <use href="/icons.svg#icon-company-logo"></use>
          </svg>
          <span className={css.logoText} style={{ color: headerColor }}>
            Подорожники
          </span>
        </Link>

        {!isMinimalHeader && (
          <>
            {user && (
              <div className={css.publishTabletOnly}>
                <Link href="/stories/create">
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
                    textColor={headerColor}
                  />
                </div>
              )}

              {!user && (
                <div className={css.authButtonsWrapper}>
                  <AuthButtons
                    variant="desktop"
                    headerVariant={headerVariant}
                  />
                </div>
              )}
            </nav>

            <button
              className={`${css.burgerBtn} ${
                headerClass === css.headerTransparent ? '' : css.burgerWhite
              }`}
              onClick={toggleMenu}
            >
              <svg
                width="24"
                height="24"
                aria-label="Menu"
                style={{ color: headerColor }}
              >
                <use href="/icons.svg#icon-menu"></use>
              </svg>
            </button>
          </>
        )}
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
        confirmButtonText={logoutMutation.isPending ? 'Вихід...' : 'Вийти'}
        cancelButtonText="Скасувати"
        onConfirm={handleLogout}
        isConfirmLoading={logoutMutation.isPending}
      />
    </header>
  );
}