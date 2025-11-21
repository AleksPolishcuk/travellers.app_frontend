'use client';

import Link from 'next/link';
import css from './AuthButtons.module.css';

type AuthButtonsProps = {
  variant?: 'mobile' | 'desktop';
  headerVariant?: 'transparent' | 'white';
  onClick?: () => void;
};

export default function AuthButtons({
  variant = 'desktop',
  headerVariant = 'white',
  onClick,
}: AuthButtonsProps) {
  const isDesktop = variant === 'desktop';

  const commonClass = css.authBtn;

  const loginClass = isDesktop
    ? `${commonClass} ${
        headerVariant === 'transparent'
          ? css.desktopLoginTransparent
          : css.desktopLoginWhite
      } ${css.desktopLoginBtn}`
    : `${commonClass} ${css.mobileLoginBtn}`;

  const registerClass = isDesktop
    ? `${commonClass} ${
        headerVariant === 'transparent'
          ? css.desktopRegisterTransparent
          : css.desktopRegisterWhite
      } ${css.desktopRegisterBtn}`
    : `${commonClass} ${css.mobileRegisterBtn}`;

  const handleClick = () => {
    onClick?.();
  };

  return (
    <ul className={css.BtnItem}>
      <li>
        <Link 
          href="/auth/login" 
          className={loginClass}
          onClick={handleClick}
        >
          Вхід
        </Link>
      </li>
      <li>
        <Link 
          href="/auth/register" 
          className={registerClass}
          onClick={handleClick}
        >
          Реєстрація
        </Link>
      </li>
    </ul>
  );
}