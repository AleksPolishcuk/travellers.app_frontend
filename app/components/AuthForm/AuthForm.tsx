'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from './RegistrationForm';
import LoginForm from './LoginForm';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  initialTab: 'sign-up' | 'sign-in';
}

export default function AuthForm({ initialTab }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'sign-up' | 'sign-in'>(initialTab);
  const router = useRouter();

  const handleTabChange = (tab: 'sign-up' | 'sign-in') => {
    setActiveTab(tab);
    router.push(`/auth/${tab}`);
  };

  return (
    <div className={styles.container}>
      {/* Таби для перемикання */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'sign-up' ? styles.active : ''}`}
          onClick={() => handleTabChange('sign-up')}
        >
          Реєстрація
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'sign-up' ? styles.active : ''}`}
          onClick={() => handleTabChange('sign-in')}
        >
          Вхід
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'sign-up' ? (
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