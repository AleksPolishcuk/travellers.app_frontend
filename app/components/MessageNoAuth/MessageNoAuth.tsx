"use client";

import styles from './MessageNoAuth.module.css';

export default function MessageNoAuth({ onClose }: { onClose: () => void }) {

    return (
      <div className={styles.overlay}>
      <div className={styles.noAuth}>
        <button className={styles.btnClose} onClick={onClose}>
        <svg className={styles.icon} viewBox="0 0 24 24" width="32" height="32">
            <use href="/icons.svg#icon-close" />
            </svg>
        </button>
        <h3 className={styles.title}>Помилка під час збереження</h3>
        <p className={styles.text}>Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису зареєструйтесь</p>
  
        <div className={styles.btns}>
          <a href="/auth/login" className={styles.btnLogin}>Увійти</a>
          <a href="/auth/register" className={styles.btnRegister}>Зареєструватись</a>
        </div>
      </div>
      </div>
    );
  }
  