export type Story = {
  _id: string;
  img: string;
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
  isFavorite?: boolean;
};
export interface StoriesResponse {
  status: number;
  message: string;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: Story[];
}
// export interface Story {
//   _id: string;
//   img?: string;
//   title: string;
//   article: string;
//   category: {
//     _id: string;
//     name: string;
//   };
//   ownerId: {
//     _id: string;
//     name: string;
//     avatarUrl?: string;
//     articlesAmount: number;
//   };
//   date: string;
//   favoriteCount: number;
// }
