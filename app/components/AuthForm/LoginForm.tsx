'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/lib/api/clientApi';
import { loginValidationSchema } from '@/lib/validation/schemas';
import styles from './AuthForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        await loginMutation.mutateAsync(values);
        router.push('/');
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  const isLoading = loginMutation.isPending;

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
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

      {loginMutation.isError && (
        <div className={styles.apiError}>
          {loginMutation.error?.message || 'Сталася помилка при вході'}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? 'Завантаження...' : 'Увійти'}
      </button>
    </form>
  );
}