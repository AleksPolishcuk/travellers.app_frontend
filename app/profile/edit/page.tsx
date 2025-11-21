import ProfileForm from '../components/ProfileForm';
import styles from './page.module.css';

export default function ProfilePage() {
  return (
    <main className={styles.page}>
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
    </main>
  );
}
