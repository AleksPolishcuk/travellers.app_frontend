'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from './RegistrationForm';
import LoginForm from './LoginForm';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  initialTab: 'register' | 'login';
}

export default function AuthForm({ initialTab }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(initialTab);
  const router = useRouter();

  const handleTabChange = (tab: 'register' | 'login') => {
    setActiveTab(tab);
    router.push(`/auth/${tab}`);
  };

  return (
    <div className={styles.container}>
      {/* Таби для перемикання */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
          onClick={() => handleTabChange('register')}
        >
          Реєстрація
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
          onClick={() => handleTabChange('login')}
        >
          Вхід
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'register' ? (
          <>
            <h1 className={styles.title}>Реєстрація</h1>
            <p className={styles.subtitle}>
              Раді вас бачити у спільноті мандрівників!
            </p>
            <RegisterForm />
          </>
        ) : (
          <>
            <h1 className={styles.title}>Вхід</h1>
            <p className={styles.subtitle}>
              Вітаємо знову у спільноту мандрівників!
            </p>
            <LoginForm />
          </>
        )}
      </div>

    </div>
  );
}