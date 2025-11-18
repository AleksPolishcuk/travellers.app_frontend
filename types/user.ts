export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  onboardingCompleted: boolean;
  savedStories?: string[];
  articlesAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: User;
}

export interface Traveller {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
}

export interface TravellersResponseData {
  travellers: Traveller[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};
//  /api/erssu / { userId };
export interface BackendArticleFromUser {
  _id: string;
  title: string;
  article: string;
  img: string;
  date: string;
  favoriteCount: number;
  authorId?: string;
}
export interface GetUsersResponse {
  data: {
    users: User[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  status: number;
  message: string;
}
export interface GetUserByIdResponse {
  status: number;
  message: string;
  data: {
    user: User;
    articles: {
      items: BackendArticleFromUser[];
      pagination: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
  };
}
export type GetArticlesResponse = {
  user: User;
  articles: ArticlesWithPagination;
  totalArticles: number;
};
export interface ArticlesWithPagination {
  items: BackendArticleFromUser[];
  pagination: PaginationData;
}
export interface PaginationData {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
