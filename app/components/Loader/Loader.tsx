'use client';

import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div id="global-loader" className={styles.container}>
      <svg className={styles.ip} viewBox="0 0 256 128">
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5ebd3e" />
            <stop offset="33%" stopColor="#ffb900" />
            <stop offset="67%" stopColor="#f78200" />
            <stop offset="100%" stopColor="#e23838" />
          </linearGradient>
          <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#e23838" />
            <stop offset="33%" stopColor="#973999" />
            <stop offset="67%" stopColor="#009cdf" />
            <stop offset="100%" stopColor="#5ebd3e" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round" strokeWidth="16">
          <g className={styles.ipTrack} stroke="#ddd">
            <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
            <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
          </g>
          <g strokeDasharray="180 656">
            <path
              className={styles.ipWorm1}
              stroke="url(#grad1)"
              strokeDashoffset="0"
              d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"
            />
            <path
              className={styles.ipWorm2}
              stroke="url(#grad2)"
              strokeDashoffset="358"
              d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
