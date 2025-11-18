export type Story = {
    _id: string;
    img?: string;
    title: string;
    article: string;
    category: { _id: string; name: string };
    ownerId: { _id: string; avatarUrl?: string; name: string; articlesAmount: number };
    date: string;
    favoriteCount: number;
    isSaved?: boolean;
};
  
export interface DataGetForm {
  _id: string;
  img?: string;
  title: string;
  article: string;
  fullText: string;
  category: { $oid: string } | string;
}

export interface UserSaveData {
  title: string;
  article: string;
  category: string;
  fullText: string;
  img: File | string;
}

export interface CreateStoryFormProps {
  id?: string;
}

export interface EditStoryFormProps {
  params: {
    id: string
  }
}

export interface StoryFormValues {
  title: string;
  category: string;
  article: string;
  fullText: string;
  img: File | string;
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
