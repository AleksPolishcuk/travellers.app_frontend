import { StoryCard } from "../StoryCard/StoryCard";
import styles from "./TravellersStories.module.css";

const TravellersStories = ({stories, loading}: any) => {
    if (loading) return <div className={styles.loading}>Завантаження...</div>;
    if(!stories || stories.length === 0)
        return <div className={styles.empty}>Немає історій</div>;

    return (
        <ul className={styles.list}>
            { stories.map((story: any) => (
                <li key={story._id}>
                    <StoryCard story={story} />
                </li>
            ))}
        </ul>
    );
};
export default TravellersStories;