import { cookies } from 'next/headers';
import { api } from '@/app/api/api';
import {
  User,
  GetUsersResponse,
  GetUserByIdResponse,
  GetArticlesResponse,
  ArticlesWithPagination,
} from '@/types/user';
import { isAxiosError } from 'axios';

import {
  CategoriesResponse,
  Category,
  FetchStoriesOptions,
  StoriesResponse,
  Story,
  StoryByIdResponse,
} from '@/types/story';

// Normalize backend user payload to always contain `_id`
function normalizeUserId(
  obj: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null | undefined {
  if (!obj || typeof obj !== 'object') return obj;
  const rec = obj as Record<string, unknown>;
  const idFromUnderscore =
    typeof rec._id === 'string' ? (rec._id as string) : undefined;
  const idFromId = typeof rec.id === 'string' ? (rec.id as string) : undefined;
  const resolvedId = idFromUnderscore ?? idFromId;
  if (resolvedId && resolvedId !== rec._id) {
    // do not mutate caller object
    return { ...rec, _id: resolvedId };
  }
  return rec;
}

/**
 * Refresh session tokens (server-side)
 */
export const checkServerSession = async () => {
  const cookieStore = await cookies();

  const res = await api.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
  return res;
};

/**
 * Get current user (server-side)
 */
export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Якщо немає жодного токена, не робити запит
    if (!accessToken && !refreshToken) {
      return null;
    }

    const { data } = await api.get('/users/me/profile', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // Backend often responds as { status, message, data: {...user} }
    const payload =
      data && typeof data === 'object'
        ? 'data' in (data as Record<string, unknown>)
          ? (data as { data: unknown }).data
          : data
        : null;

    const normalized = normalizeUserId(payload) as User | null;
    return (normalized as User) ?? null;
  } catch {
    return null;
  }
};

export async function getUsersServer(
  page = 1,
  perPage = 4,
): Promise<GetUsersResponse> {
  try {
    const res = await api.get<GetUsersResponse>('/users', {
      params: { page, perPage },
    });
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('[getUsersServer error]', error.message);
      throw new Error(
        error.response?.data?.error || 'Failed to fetch users from server',
      );
    } else {
      console.error('[getUsersServer unknown error]', error);
      throw new Error('Unknown server error');
    }
  }
}

export async function getArticlesByUserServer(
  travellerId: string,
  page: number = 1,
  perPage: number = 6,
): Promise<GetArticlesResponse> {
  try {
    const res = await api.get<GetUserByIdResponse>(`/users/${travellerId}`, {
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
    console.error('[getArticlesByUserServer] Error:', error);
    throw new Error('Failed to fetch user articles from server');
  }
}

export async function getUserByIdServer(
  userId: string,
): Promise<GetUserByIdResponse> {
  try {
    const res = await api.get<GetUserByIdResponse>(`/users/${userId}`);
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('[getUsersServer error]', error.message);
      throw new Error(
        error.response?.data?.error || 'Failed to fetch users from server',
      );
    } else {
      console.error('[getUsersServer unknown error]', error);
      throw new Error('Unknown server error');
    }
  }
}

export async function getStoriesServer(
  page: number = 1,
  perPage: number = 10,
): Promise<{ data: GetArticlesResponse }> {
  const res = await api.get(`/stories`, {
    params: { page, perPage },
  });
  return res.data;
}

export const fetchStoryByIdServer = async (storyId: string): Promise<Story> => {
  const res = await api.get<StoryByIdResponse>(`/stories/${storyId}`);
  return res.data.data;
};
//function of Sergii Sotnikov
export const fetchStoriesServerDup = async ({
  page,
  perPage,
  excludeId,
}: FetchStoriesOptions): Promise<StoriesResponse> => {
  const res = await api.get<StoriesResponse>('/stories', {
    params: { page, perPage, excludeId },
  });
  return res.data;
};

export async function fetchStoriesServer(
  page: number = 1,
  perPage: number = 10,

  excludeId?: string,
): Promise<Story[]> {
  const response = await api.get<StoriesResponse>(`/stories`, {
    params: { page, perPage, sort: 'favoriteCount', excludeId },
  });

  return response.data?.data || [];
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<CategoriesResponse>('/categories');
  return res.data.data;
}

export const fetchSavedStoriesMeServer = async () => {
  const cookieHeader = (await cookies()).toString();

  const res = await api.get('/users/me/saved', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data.data.savedStories;
};

/**
 * Get current user profile with articles (server-side)
 */
export async function getMeProfileServer(): Promise<{
  user: User;
  articles: Story[];
} | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
      return null;
    }

    const res = await api.get('/users/me/profile', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const profileData = res.data.data;

    // Створюємо User об'єкт
    const user: User = {
      _id: profileData._id,
      name: profileData.name,
      avatarUrl: profileData.avatarUrl,
      articlesAmount: profileData.articlesAmount,
      createdAt: profileData.createdAt,
      updatedAt: profileData.updatedAt,
      description: profileData.description ?? undefined,
    };

    // Завантажуємо повну інформацію про кожну історію (включаючи article)
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
            const fullStory = await fetchStoryByIdServer(article._id);
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
                _id: user._id,
                name: user.name,
                avatarUrl: user.avatarUrl || '',
                articlesAmount: user.articlesAmount,
                description: user.description ?? undefined,
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
  } catch {
    return null;
  }
}

/**
 * Get user saved articles (server-side)
 */
export async function getUserSavedArticlesServer(userId: string): Promise<{
  user: User;
  savedStories: Story[];
} | null> {
  try {
    const cookieStore = await cookies();
    const res = await api.get(`/users/${userId}/saved-articles`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const data = res.data.data;

    const user: User = {
      _id: data.user._id,
      name: data.user.name,
      avatarUrl: data.user.avatarUrl,
      articlesAmount: data.user.articlesAmount || 0,
      createdAt: data.user.createdAt,
      description: data.user.description ?? undefined,
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
            const fullStory = await fetchStoryByIdServer(savedStory._id);
            return fullStory;
          } catch {
            // Fallback до базової інформації
            return {
              _id: savedStory._id,
              img: savedStory.img,
              title: savedStory.title,
              article: savedStory.article || '',
              category: savedStory.category,
              ownerId: {
                _id: user._id,
                name: user.name,
                avatarUrl: user.avatarUrl || '',
                articlesAmount: user.articlesAmount,
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
  } catch {
    return null;
  }
}
