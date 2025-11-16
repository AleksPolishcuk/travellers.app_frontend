import ProfileForm from './components/ProfileForm';
import styles from './page.module.css';

export default function ProfilePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <svg className={styles.logo} width="19" height="23" aria-hidden="true">
          <use xlinkHref="/icons.svg#icon-company-logo" />
        </svg>
        <span className={styles.headerText}>Подор</span>
      </header>

      <section className={styles.content}>
        <h1 className={styles.title}>
          Давайте
          <br />
          познайомимось
          <br />
          ближче
        </h1>

        <ProfileForm />
      </section>

      <footer className={styles.footer}>© 2025 Подорожники</footer>
    </main>
  );
}
