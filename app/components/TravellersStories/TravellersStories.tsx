import { Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[];
  isAuthenticated: boolean;
  className?: string; 
  onRemoveSavedStory?: (id: string) => void; 
  isMyStory?: boolean;
}

export default function TravellersStories({
  stories,
  isAuthenticated,
  className,
  isMyStory,
  onRemoveSavedStory,
}: TravellersStoriesProps) {
  return (
    <ul className={`${css.stories__list} ${className || ''}`}>
      {stories.map(story => (
        <TravellersStoriesItem
          key={story._id}
          story={story}
          isAuthenticated={isAuthenticated}
          onRemoveSavedStory={onRemoveSavedStory}
          isMyStory={isMyStory}
        />
      ))}
    </ul>
  );
}