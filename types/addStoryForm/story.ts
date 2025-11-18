type Category =
  | 'Європа'
  | 'Азія'
  | 'Пустелі'
  | 'Африка'
  | 'Гори'
  | 'Америка'
  | 'Балкани'
  | 'Кавказ'
  | 'Океанія';

interface StoryData {
  _id: string;
  imageUrl: string;
  title: string;
  article: string;
  category: {
    _id: string;
    name: string;
  };
  ownerId: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  publishedDate: string;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStory {
  title: string;
  article: string;
  category: Category;
  img: File;
}

export interface StoryResponse {
  status: number;
  message: string;
  data: StoryData;
}
