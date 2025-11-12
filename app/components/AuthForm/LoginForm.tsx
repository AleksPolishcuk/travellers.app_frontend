'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/store/authStore';
import styles from './AuthForm.module.css';

interface FormDataState {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    password: ''
  });
  
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const savedData = localStorage.getItem('loginFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loginFormData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { email, password } = formData;

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
      
      localStorage.removeItem('loginFormData');
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
    <form onSubmit={handleSubmit} className={styles.form}>
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
          value={formData.email}
          onChange={handleInputChange}
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
          value={formData.password}
          onChange={handleInputChange}
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