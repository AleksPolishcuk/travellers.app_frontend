'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/store/authStore';
import styles from './AuthForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email.includes('@')) {
        setError('Некоректний формат email');
        return;
      }

      if (!password || password.length < 8) {
        setError('Пароль повинен містити мінімум 8 символів');
        return;
      }

      const userData = {
        email,
        password,
      };

      const user = await login(userData);
      setUser(user);
      router.push('/');

    } catch (error) {
      console.error('Login error:', error);
      setError(
        error instanceof Error ? error.message : 'Сталася помилка входу'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          Пошта*
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="hello@podorozhnyky.ua"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>
          Пароль*
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          className={styles.input}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? 'Завантаження...' : 'Увійти'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}