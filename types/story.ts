// types/story.ts

export interface Category {
  _id: string;
  name: string;
}

/**
 * Коротка інформація про власника історії (щоб не вимагати повний User)
 */
export interface StoryOwner {
  _id: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  articlesAmount?: number;
}

/**
 * Головний тип Story, який використовується у списках
 */
export type Story = {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  ownerId: StoryOwner;
  date: string;
  favoriteCount: number;
  isFavorite?: boolean;
};

/**
 * Відповідь списку історій (пагінація)
 */
export interface StoriesResponse {
  status: number;
  message: string;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: Story[];
}

/**
 * Тип для збережених історій (може бути спрощеним)
 */
export interface SavedStory {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  date: string;
  favoriteCount: number;
}

/**
 * Відповідь при отриманні конкретної історії за id
 */
export type StoryByIdResponse = {
  status: number;
  message: string;
  data: {
    _id: string;
    img: string;
    title: string;
    article: string;
    category: Category;
    ownerId: {
      _id: string;
      name: string;
      avatarUrl?: string;
      description?: string;
      articlesAmount?: number;
    };
    date: string;
    favoriteCount: number;
  };
};

/**
 * Відповідь при отриманні збережених статей користувача
 */
export interface UserSavedArticlesResponse {
  status: number;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      avatarUrl?: string;
      description?: string;
      createdAt?: string;
      articlesAmount?: number;
    };
    savedStories: SavedStory[];
  };
}
