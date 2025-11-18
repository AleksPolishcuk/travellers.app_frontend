'use client';

import { useState, useRef, useEffect } from 'react';
import { CategoryType } from '@/types/category';
import styles from './CategoriesMenu.module.css';

type CategoriesMenuProps = {
  categories: CategoryType[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
};

const CategoriesMenu = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Відкриття/закриття меню
  const toggleMenu = () => setIsOpen(!isOpen);

  // Закриття при кліку поза меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обробник вибору категорії
  const handleSelect = (name: string) => {
    onSelectCategory(name === 'Всі історії' ? null : name);
    setIsOpen(false);
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button onClick={toggleMenu} className={styles.menuBtn}>
        {selectedCategory ?? 'Всі історії'}
        <svg className={styles.selectIcon} width="24" height="24">
          <use href="/icons.svg#icon-arrow-down"></use>
        </svg>
      </button>

      <ul
        className={`${styles.menu} ${isOpen ? styles.open : ''}`}
        style={{ maxHeight: isOpen ? '500px' : '0px' }}
      >
        <li
          className={`${styles.menuItem} ${selectedCategory === null ? styles.active : ''}`}
          onClick={() => handleSelect('Всі історії')}
        >
          Всі історії
        </li>

        {categories.map((category) => (
          <li
            key={category._id}
            className={`${styles.menuItem} ${selectedCategory === category.name ? styles.active : ''}`}
            onClick={() => handleSelect(category.name)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesMenu;
