import styles from './Category.module.css';
import type { CategoryType } from '@/types/category';

interface CategoryProps {
  category: CategoryType;
  active: boolean;
  onClick: () => void;
}

export const Category = ({ category, active, onClick }: CategoryProps) => {
  return (
    <button
      className={`${styles.category} ${active ? styles.activeCategory : ''}`}
      onClick={onClick}
    >
      {category.name}
    </button>
  );
};
