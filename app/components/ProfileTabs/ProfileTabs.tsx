'use client';

import css from './ProfileTabs.module.css';

type TabType = 'saved' | 'my';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <div className={css.tabsContainer}>
      <button
        type="button"
        className={`${css.tab} ${activeTab === 'saved' ? css.tabActive : ''}`}
        onClick={() => onTabChange('saved')}
      >
        Збережені історії
      </button>
      <button
        type="button"
        className={`${css.tab} ${activeTab === 'my' ? css.tabActive : ''}`}
        onClick={() => onTabChange('my')}
      >
        Мої історії
      </button>
    </div>
  );
}