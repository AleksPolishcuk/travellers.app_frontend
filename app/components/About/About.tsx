import styles from './About.module.css';

export default function About(){
    return (
    <section className={styles.about}>
        <div className={styles.container}>
        <div className={styles.titleContainer}>
            <h2 className={styles.aboutTitle}>Проєкт, створений для тих, хто живе подорожами</h2>
            <p className={styles.subtitle}>Ми віримо, що кожна подорож — це унікальна історія, варта того, щоб нею поділилися. Наша платформа створена, щоб об'єднати людей, закоханих у відкриття нового. Тут ви можете ділитися власним досвідом, знаходити друзів та надихатися на наступні пригоди разом з нами.</p>
        </div>

        <ul className={styles.cards}>
            <li className={styles.card}>
            <svg className={styles.icon} viewBox="0 0 24 24" width="48" height="48">
            <use className={styles.iconSvg} href="/icons.svg#icon-wand-stars" />
            </svg>
                <h3 className={styles.cardTitle}>Наша місія</h3>
                <p className={styles.cardSubtitle}>Об'єднувати людей через любов до пригод та надихати на нові відкриття.</p>
            </li>
            <li className={styles.card}>
            <svg className={styles.icon} viewBox="0 0 24 24" width="48" height="48">
            <use href="/icons.svg#icon-travel-bag" />
            </svg>
                <h3 className={styles.cardTitle}>Автентичні історії</h3>
                <p className={styles.cardSubtitle}>Ми цінуємо справжні, нередаговані враження від мандрівників з усього світу.</p>
            </li>
            <li className={styles.card}>
            <svg className={styles.icon} viewBox="0 0 24 24" width="48" height="48">
            <use href="/icons.svg#icon-communication" />
            </svg>
                <h3 className={styles.cardTitle}>Ваша спільнота</h3>
                <p className={styles.cardSubtitle}>Станьте частиною спільноти, де кожен може бути і автором, і читачем.</p>
            </li>
        </ul>
        </div>
    </section>
    );
}