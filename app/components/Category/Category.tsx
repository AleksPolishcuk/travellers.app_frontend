import styles from './Category.module.css';
import type { CategoryType } from '@/types/category';

interface CategoryProps {
    category: CategoryType;
    active: boolean;
    onClick: () => void;
};

export const Category = ({ category, active, onClick }: CategoryProps) => {
    return (
<div className={styles.categoryBtn}>

<button
        className={active ? styles.activeCategory : styles.category}
        onClick={onClick}
      >
        {category.name}
      </button>
</div>
       
    );
  };