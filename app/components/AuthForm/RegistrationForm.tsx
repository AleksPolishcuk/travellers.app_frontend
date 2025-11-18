'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/lib/api/clientApi';
import { registerValidationSchema } from '@/lib/validation/schemas';
import styles from './AuthForm.module.css';

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      try {
        await registerMutation.mutateAsync(values);
        router.push('/');
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
  });

  const isLoading = registerMutation.isPending;

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label 
          htmlFor="name" 
          className={`${styles.label} ${
            formik.touched.name && formik.errors.name ? styles.labelError : ''
          }`}
        >
          Імʼя та Прізвище*
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ваше імʼя та прізвище"
          className={`${styles.input} ${
            formik.touched.name && formik.errors.name ? styles.inputError : ''
          }`}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isLoading}
        />
        {formik.touched.name && formik.errors.name && (
          <div className={styles.errorText}>{formik.errors.name}</div>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label 
          htmlFor="email" 
          className={`${styles.label} ${
            formik.touched.email && formik.errors.email ? styles.labelError : ''
          }`}
        >
          Пошта*
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="hello@podorozhnyky.ua"
          className={`${styles.input} ${
            formik.touched.email && formik.errors.email ? styles.inputError : ''
          }`}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isLoading}
        />
        {formik.touched.email && formik.errors.email && (
          <div className={styles.errorText}>{formik.errors.email}</div>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label 
          htmlFor="password" 
          className={`${styles.label} ${
            formik.touched.password && formik.errors.password ? styles.labelError : ''
          }`}
        >
          Пароль*
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          className={`${styles.input} ${
            formik.touched.password && formik.errors.password ? styles.inputError : ''
          }`}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isLoading}
        />
        {formik.touched.password && formik.errors.password && (
          <div className={styles.errorText}>{formik.errors.password}</div>
        )}
      </div>

      {registerMutation.isError && (
        <div className={styles.apiError}>
          {registerMutation.error?.message || 'Сталася помилка при реєстрації'}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? 'Завантаження...' : 'Зареєструватись'}
      </button>
    </form>
  );
}