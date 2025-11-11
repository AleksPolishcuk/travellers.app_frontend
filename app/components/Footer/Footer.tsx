'use client';

import Link from 'next/link';
import Image from 'next/image';
import css from './Footer.module.css';

interface User {
  name?: string;
}

interface FooterProps {
  user?: User | null;
}

export default function Footer({ user }: FooterProps) {
  return (
    <footer className={css.footer}>
      <div className={css.footerContainer}>
        <div className={css.footerDeck}>
          <div className={css.footerTop}>
            <div className={css.logoWrapper}>
              <Link
                href="/"
                className={css.logoLink}
                aria-label="Go to homepage"
              >
                <svg width="30" height="30">
                  <use href="/icons.svg#icon-company-logo"></use>
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
                  <svg width="24" height="24" aria-label="close">
                    <use href="/icons.svg#icon-facebook"></use>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="24" height="24" aria-label="close">
                    <use href="/icons.svg#icon-instagram"></use>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="24" height="24" aria-label="close">
                    <use href="/icons.svg#icon-twitter"></use>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="24" height="24" aria-label="close">
                    <use href="/icons.svg#icon-youtube"></use>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <nav className={css.footerNav}>
            <ul>
              <li>
                <Link href={user ? '/' : '/auth/register'}>Головна</Link>
              </li>
              <li>
                <Link href={user ? '/stories' : '/auth/register'}>Історії</Link>
              </li>
              <li>
                <Link href={user ? '/travellers' : '/auth/register'}>
                  Мандрівники
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/profile">Профіль</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className={css.footerBottom}>
          <p>© 2025 Подорожники. Усі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}
