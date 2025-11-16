'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import css from './Footer.module.css';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  const { user, isAuthenticated } = useAuthStore();

  const authLinks = [
    { label: 'Головна', href: '/' },
    { label: 'Історії', href: '/stories' },
    { label: 'Мандрівники', href: '/travellers' },
  ];

  const guestLinks = [
    { label: 'Головна', href: '/auth/register' },
    { label: 'Історії', href: '/auth/register' },
    { label: 'Мандрівники', href: '/auth/register' },
    { label: 'Профіль', href: '/auth/register' },
  ];

  const navLinks = isAuthenticated ? authLinks : guestLinks;

  return (
    <footer className={isAuthPage ? css.authFooter : css.footer}>
      <div className={css.footerContainer}>
        {/* Показываем footerDeck только на не-auth страницах */}
        {!isAuthPage && (
          <div className={css.footerDeck}>
            <div className={css.footerTop}>
              {/* Лого */}
              <div className={css.logoWrapper}>
                <Link
                  href="/"
                  className={css.logoLink}
                  aria-label="Go to homepage"
                >
                  <svg width="30" height="30">
                    <use href="/icons.svg#icon-company-logo" />
                  </svg>
                  <span className={css.logoText}>Подорожники</span>
                </Link>
              </div>

              <ul className={css.socialList}>
                <li>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="24" height="24">
                      <use href="/icons.svg#icon-facebook" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="24" height="24">
                      <use href="/icons.svg#icon-instagram" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="24" height="24">
                      <use href="/icons.svg#icon-twitter" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="24" height="24">
                      <use href="/icons.svg#icon-youtube" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            {/* Навигация */}
            <nav className={css.footerNav}>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Нижняя часть футера */}
        <div className={css.footerBottom}>
          <p> © 2025 Подорожники {!isAuthPage && ' • Усі права захищені.'} </p>
        </div>
      </div>
    </footer>
  );
}
