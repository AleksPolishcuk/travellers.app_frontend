import { useState } from 'react';
import Link from 'next/link';
import styles from './StoryCard.module.css';
import { Story } from '@/types/story';

interface StoryCardProps {
  story: Story;
}
export function StoryCard ({story}: StoryCardProps) {

const [articlesAmount, setArticlesAmount] = useState(story.ownerId.articlesAmount);

const handleSaveClick = () => {
    setArticlesAmount(prev => prev + 1);
}

    return (
        <li key={story._id} className={styles.listItem}>
              <div className={styles.storyImg}>
                <img
                  className={styles.listImg}
                  src={story.img}
                  alt={story.title}
                />
              </div>
              <div className={styles.storyContent}>
                <div className={styles.content}>
                  <p className={styles.category}>Category</p>
                  <h3 className={styles.title}>{story.title}</h3>
                  <p className={styles.article}>
                    {story.article
                      ? story.article.substring(0, 90) + '...'
                      : 'Опис відсутній'}
                  </p>
                </div>
                <div className={styles.user}>
                  <div className={styles.imgCard}>
                    <img
                      className={styles.userImg}
                      src={story.ownerId.avatarUrl}
                    />
                    <div className={styles.userInfo}>
                      <h4 className={styles.userName}>{story.ownerId.name}</h4>

                      <div className={styles.userContent}>
                        <span className={styles.listDate}>{story.date}</span>
                        <span className={styles.point}></span>

                        <div className={styles.rate}>
                          <span className={styles.userCount}>
                            {articlesAmount}
                          </span>
                          <svg viewBox="4 4 16 16"
                            className={styles.userBookmark}
                          >
                            <use href="/icons.svg#icon-bookmark"></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.storyView}>
                  <Link href={`/stories/${story._id}`} passHref>
                  <button type="button" className={styles.storyButton}>
                    Переглянути статтю
                  </button></Link>
                  <button type="button" className={styles.saveButton} onClick={handleSaveClick}>
                    <svg width="24" height="24">
                      <use
                        className={styles.icon}
                        href="/icons.svg#icon-bookmark"
                      ></use>
                    </svg>
                  </button>
                </div>
              </div>
            </li>
    )
}
