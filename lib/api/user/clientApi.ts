import {
  User,
  GetUsersResponse,
  GetUserByIdResponse,
  GetArticlesResponse,
  ArticlesWithPagination,
} from '@/types/user';

import { LoginRequest, RegisterRequest } from '../../../types/user';
import { extractUser } from './errorHandler';

import {
  SavedStory,
  StoriesResponse,
  Story,
  StoryByIdResponse,
  UserSavedArticlesResponse,
} from '@/types/story';
import { AxiosError, isAxiosError } from 'axios';
import { api } from '../api';
import { CreateStory, StoryResponse } from '../../../types/addStoryForm/story';

export type ApiError = AxiosError<{ error: string }>;

/**
 * Register user
 */
export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>('/auth/register', data);
  const user = extractUser(res.data) as User | null;
  return user;
};

/**
 * Login user
 */
export const login = async (data: LoginRequest) => {
  const res = await api.post<User>('/auth/login', data);
  const user = extractUser(res.data) as User | null;

  return user;
};

/**
 * Google OAuth — отримання URL для входу через Google
 */
export async function getGoogleAuthUrl(): Promise<string> {
  const { data } = await api.get('/auth/google/get-oauth-url');

  return data?.data?.url || '';
}

/**
 * Підтвердження входу після редіректу з Google
 */
export const authConfirmGoogle = async (code: string) => {
  try {
    const res = await api.post<User>('/auth/google/confirm-oauth', { code });
    const user = extractUser(res.data) as User | null;
    return user;
  } catch (error) {
    console.error('❌ Google OAuth confirm error:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getMe = async (silent: boolean = false) => {
  try {
    const response = await api.get('/users/me');

    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data && response.data.data) {
        const userData = response.data.data;
        if (
          userData &&
          typeof userData === 'object' &&
          '_id' in userData &&
          'name' in userData
        ) {
          return userData as User;
        }
      }

      const user = extractUser(response.data) as User | null;
      if (user) {
        return user;
      }
    }

    return null;
  } catch (error) {
    if (silent) {
      // Тиха обробка - не логуємо помилку
      return null;
    }
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      // 401  якщо користувач не залогінений
      // Не логуємо як помилку
      return null;
    }

    // ✅ Логуємо інші помилки
    console.error('❌ Error in getMe:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore errors on logout
  }
};

/**
 * Try to refresh session on the client (will set cookies via Next API route)
 */
export async function refreshSession(): Promise<boolean> {
  try {
    await api.post('/auth/refresh', {});
    return true;
  } catch {
    return false;
  }
}
/**
 * Check if session is valid (lightweight check)
 */
export const checkSession = async (): Promise<boolean> => {
  try {
    console.log('🔍 Checking session via /api/users/me');
    const response = await api.get('/users/me');
    console.log('✅ Session check response:', response.status);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.log('Session check failed:', error);

    return false;
  }
};

export async function fetchStories(
  page = 1,
  perPage = 3,
  categoryId?: string,
): Promise<Story[]> {
  const response = await api.get<StoriesResponse>(`/stories`, {
    params: { page, perPage, sort: 'favoriteCount', category: categoryId },
  });
  return response.data?.data || [];
}

export async function addStoryToFavorites(storyId: string): Promise<void> {
  await api.post(`/users/me/saved/${storyId}`);
}

export async function removeStoryFromFavorites(storyId: string): Promise<void> {
  await api.delete(`/users/me/saved/${storyId}`);
}

export async function getUsersClient({
  page = 1,
  perPage = 4,
}: {
  page: number;
  perPage: number;
}): Promise<GetUsersResponse> {
  const res = await api.get<GetUsersResponse>('/users', {
    params: { page, perPage },
  });
  return res.data;
}
export async function getArticlesByUserClient(
  travellerId: string,
  page: number,
  perPage: number,
): Promise<GetArticlesResponse> {
  try {
    const url = `/users/${travellerId}`;
    const res = await api.get<GetUserByIdResponse>(url, {
      params: { page, perPage },
    });

    const articles: ArticlesWithPagination = res.data.data.articles;
    const totalArticles = articles.pagination.totalItems;
    return {
      user: res.data.data.user,
      articles: articles,
      totalArticles: totalArticles,
    };
  } catch (error: unknown) {
    console.error('[getArticlesByUserClient] Full error details:', error);

    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          `Request failed with status code ${error.response?.status}`,
      );
    } else {
      console.error('[getArticlesByUserClient] Unknown error type:', {
        error,
        errorType: typeof error,
        isErrorInstance: error instanceof Error,
      });
      throw new Error('Unknown client error');
    }
  }
}

export async function fetchStoryByIdClient(storyId: string): Promise<Story> {
  const response = await api.get<StoryByIdResponse>(`/stories/${storyId}`);
  const story = response.data.data;

  // Забезпечуємо, що ownerId має articlesAmount (щоб уникнути помилок типізації)
  const owner = {
    ...story.ownerId,
    articlesAmount: (story.ownerId as any)?.articlesAmount ?? 0,
    // Якщо бекенд не повернув email/onboarding — не змінюємо ownerId тут,
  };

  return {
    ...story,
    ownerId: owner as any,
  } as Story;
}

export async function fetchSavedStoriesByUserId(
  userId: string,
): Promise<SavedStory[]> {
  console.log('fetchSavedStoriesByUserId CALL with userId:', userId);

  const res = await api.get<UserSavedArticlesResponse>(
    `/users/${userId}/saved-articles`,
  );

  console.log(
    'fetchSavedStoriesByUserId RESPONSE:',
    res.data.data.savedStories,
  );

  return res.data.data.savedStories;
}

/**
 * Get current user profile with articles
 */
export async function getMeProfile(): Promise<{
  user: User;
  articles: Story[];
}> {
  const res = await api.get('/users/me/profile');
  const profileData = res.data.data;

  // Заповнюємо обов'язкові поля email + onboardingCompleted дефолтами якщо потрібно
  const user: User = {
    _id: profileData._id,
    name: profileData.name,
    email: profileData.email ?? '',
    onboardingCompleted: profileData.onboardingCompleted ?? false,
    avatarUrl: profileData.avatarUrl,
    articlesAmount: profileData.articlesAmount ?? 0,
    createdAt: profileData.createdAt,
    updatedAt: profileData.updatedAt,
    description: profileData.description ?? undefined,
    savedStories: profileData.savedStories ?? undefined,
  };

  // Завантажуємо повну інформацію про кожну історію
  const articles = await Promise.allSettled(
    (profileData.articles || []).map(
      async (article: {
        _id: string;
        title: string;
        img: string;
        date: string;
        favoriteCount: number;
        createdAt: string;
        category: { _id: string; name: string };
      }) => {
        try {
          const fullStory = await fetchStoryByIdClient(article._id);
          return fullStory;
        } catch {
          // Fallback до базової інформації без article
          return {
            _id: article._id,
            img: article.img,
            title: article.title,
            article: '',
            category: article.category,
            ownerId: {
              _id: profileData._id,
              name: profileData.name,
              avatarUrl: profileData.avatarUrl ?? '',
              articlesAmount: profileData.articlesAmount ?? 0,
              description: profileData.description ?? undefined,
              // Якщо бекенд не дав email/onboarding — це нормально для ownerId
            },
            date: article.date,
            favoriteCount: article.favoriteCount,
          } as Story;
        }
      },
    ),
  );

  const stories = articles
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter((story): story is Story => story !== null);

  return { user, articles: stories };
}

/**
 * Get user saved articles
 * Завантажує повну інформацію про кожну збережену історію, включаючи ownerId
 */
export async function getUserSavedArticles(userId: string): Promise<{
  user: User;
  savedStories: Story[];
}> {
  const res = await api.get(`/users/${userId}/saved-articles`);
  const data = res.data.data;

  const user: User = {
    _id: data.user._id,
    name: data.user.name,
    email: data.user.email ?? '',
    onboardingCompleted: data.user.onboardingCompleted ?? false,
    avatarUrl: data.user.avatarUrl,
    articlesAmount: data.user.articlesAmount ?? 0,
    createdAt: data.user.createdAt,
    description: data.user.description ?? undefined,
    savedStories: data.user.savedStories ?? undefined,
  };

  // Завантажуємо повну інформацію про кожну збережену історію (включаючи ownerId)
  const savedStories = await Promise.allSettled(
    (data.savedStories || []).map(
      async (savedStory: {
        _id: string;
        img: string;
        title: string;
        article: string;
        date: string;
        favoriteCount: number;
        category: { _id: string; name: string };
      }) => {
        try {
          // Завантажуємо повну інформацію про історію, включаючи ownerId
          const fullStory = await fetchStoryByIdClient(savedStory._id);
          return fullStory;
        } catch {
          // Fallback до базової інформації без ownerId (має не статися, але на всяк випадок)
          return {
            _id: savedStory._id,
            img: savedStory.img,
            title: savedStory.title,
            article: savedStory.article || '',
            category: savedStory.category,
            ownerId: {
              _id: user._id,
              name: user.name,
              avatarUrl: user.avatarUrl ?? '',
              articlesAmount: user.articlesAmount ?? 0,
              description: user.description ?? undefined,
            },
            date: savedStory.date,
            favoriteCount: savedStory.favoriteCount,
          } as Story;
        }
      },
    ),
  );

  const stories = savedStories
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter((story): story is Story => story !== null);

  return {
    user,
    savedStories: stories,
  };
}

export async function fetchSavedStoriesMe(): Promise<SavedStory[]> {
  const res = await api.get<UserSavedArticlesResponse>(
    '/users/me/saved-articles',
  );
  return res.data.data.savedStories;
}

// Story create form

export async function createStory(
  newStory: CreateStory,
): Promise<StoryResponse> {
  const formData = new FormData();
  formData.append('title', newStory.title);
  formData.append('article', newStory.article);
  formData.append('category', newStory.category);
  formData.append('img', newStory.img);

  const { data } = await api.post<StoryResponse>('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
