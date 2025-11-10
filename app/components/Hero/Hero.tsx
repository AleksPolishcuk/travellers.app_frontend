'use client';

import css from './Hero.module.css';

export default function Hero() {
  return (
    <section className={css.hero}>
      <div className={css.heroContainer}>
        <h1 className={css.heroTitle}>
          Відкрийте світ <br /> подорожей з нами!
        </h1>
        <p className={css.heroText}>
          Приєднуйтесь до нашої спільноти мандрівників, де ви зможете ділитися
          своїми історіями та отримувати натхнення для нових пригод. Відкрийте
          для себе нові місця та знайдіть однодумців!
        </p>

        <a href="#join" className={css.heroBtn}>
          Доєднатись
        </a>
      </div>
    </section>
  );
}
