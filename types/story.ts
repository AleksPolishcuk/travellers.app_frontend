export type Story = {
  _id: string;
  img?: string;
  title: string;
  article: string;
  category: { _id: string; name: string };
  ownerId: {
    _id: string;
    avatarUrl?: string;
    name: string;
    articlesAmount: number;
  };
  date: string;
  favoriteCount: number;
  isSaved?: boolean;
};

