'use client';

import { useRouter } from 'next/navigation';
import css from './AuthButtons.module.css';

type AuthButtonsProps = {
  variant?: 'mobile' | 'desktop';
  onClick?: () => void;
};

export default function AuthButtons({
  variant = 'desktop',
  onClick,
}: AuthButtonsProps) {
  const router = useRouter();

  const loginClass =
    variant === 'mobile' ? css.mobileLoginBtn : css.desktopLoginBtn;
  const registerClass =
    variant === 'mobile' ? css.mobileRegisterBtn : css.desktopRegisterBtn;

  return (
    <>
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
    </>
  );
}
