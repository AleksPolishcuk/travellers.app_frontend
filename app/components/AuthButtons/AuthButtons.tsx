'use client';

import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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

  return (
    <ul className={css.BtnItem}>
      <li>
        <button
          className={loginClass}
          onClick={() => {
            onClick?.();
            router.push('/auth/login');
          }}
        >
          Вхід
        </button>
      </li>
      <li>
        <button
          className={registerClass}
          onClick={() => {
            onClick?.();
            router.push('/auth/register');
          }}
        >
          Реєстрація
        </button>
      </li>
    </ul>
  );
}
