import {
  User,
  RegisterRequest,
  LoginRequest,
  TravellersResponseData,
} from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '@/lib/utils/errorHandler';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL =
  typeof window !== 'undefined' ? '' : 'http://localhost:3000';

const buildUrl = (path: string) => {
  const p = path.startsWith('/') ? path : `/${path}`;

  return `/api${p}`;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ reject }) => {
    if (error) reject(error);
  });
  failedQueue = [];
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const fullUrl = buildUrl(url);

    const doFetch = () =>
      fetch(fullUrl, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

    const response = await doFetch();

    if (response.status === 401 && !url.includes('/auth/refresh-session')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => doFetch())
          .then(async (r) => {
            if (!r.ok) {
              throw new Error(`HTTP error! status: ${r.status}`);
            }
            return await r.json();
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(buildUrl('/auth/refresh-session'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshResponse.ok) {
          processQueue(null);

          const retryResponse = await doFetch();
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          return retryResponse.json();
        }

        processQueue(new Error('Не вдалося оновити сесію'));
        useAuthStore.getState().clearUser();
        throw new Error('Сесія закінчилася. Будь ласка, увійдіть знову.');
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().clearUser();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        try {
          const text = await response.text();
          errorMessage = text || errorMessage;
        } catch {}
      }

      if (response.status === 404) throw new Error('Ресурс не знайдено.');
      if (response.status === 401) throw new Error('Необхідна авторизація');

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API Fetch Error:', error);

    if (
      error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('NetworkError')
    ) {
      throw new Error('Помилка мережі. Перевірте підключення до інтернету.');
    }
    throw error;
  }
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildUrl('/auth/refresh-session'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const register = async (userData: RegisterRequest): Promise<User> => {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return data.data;
};

export const login = async (userData: LoginRequest): Promise<User> => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return data.data;
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await apiFetch('/users/me');
    return data.data;
  } catch (error: any) {
    if (
      error?.message?.includes('Необхідна авторизація') ||
      error?.message?.includes('401')
    ) {
      return null;
    }
    throw error;
  }
};

export const getTravellers = async (
  page: number,
  limit: number,
): Promise<TravellersResponseData> => {
  const data = await apiFetch(`/users/travellers?page=${page}&limit=${limit}`);
  return data.data;
};

export const getStories = async (
  page: number = 1,
  perPage: number = 9,
  categoryName?: string | null,
): Promise<any> => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  if (categoryName) params.set('categoryName', categoryName);

  return apiFetch(`/stories?${params.toString()}`);
};

export const getCategories = async (): Promise<any> => {
  return apiFetch('/stories/categories');
};

export const saveStory = async (storyId: string): Promise<any> => {
  return apiFetch(`/stories/${storyId}/saved`, { method: 'POST' });
};

export const removeSavedStory = async (storyId: string): Promise<any> => {
  return apiFetch(`/stories/${storyId}/saved`, { method: 'DELETE' });
};

export const getSavedStories = async (page = 1, perPage = 9): Promise<any> => {
  return apiFetch(`/stories/saved?page=${page}&perPage=${perPage}`);
};

const handleLoginError = (error: any): string => {
  const errorMessage = error?.message || 'Помилка входу';

  if (
    errorMessage.includes('user not found') ||
    errorMessage.includes('користувача не знайдено') ||
    errorMessage.includes('User not found') ||
    errorMessage.toLowerCase().includes('not found') ||
    errorMessage.includes('404') ||
    errorMessage.includes('неправильний email або пароль')
  ) {
    return 'Користувача не знайдено.';
  }

  if (
    errorMessage.includes('password') ||
    errorMessage.includes('пароль') ||
    errorMessage.includes('invalid password') ||
    errorMessage.includes('невірний пароль')
  ) {
    return 'Невірний email або пароль.';
  }

  if (errorMessage.includes('email') || errorMessage.includes('пошта')) {
    return 'Невірний формат email.';
  }

  if (
    errorMessage.includes('Помилка мережі') ||
    errorMessage.includes('Failed to fetch')
  ) {
    return 'Помилка мережі. Перевірте підключення до інтернету.';
  }

  return 'Сталася невідома помилка. Спробуйте ще раз.';
};

const handleRegisterError = (error: any): string => {
  const errorMessage = error?.message || 'Помилка реєстрації';

  if (
    errorMessage.includes('email already exists') ||
    errorMessage.includes('email вже використовується') ||
    errorMessage.includes('user already exists') ||
    errorMessage.includes('користувач вже існує')
  ) {
    return 'Користувач з таким email вже існує.';
  }

  return errorMessage;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: async (userData: LoginRequest) => {
      setLoading(true);
      try {
        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
        return data.data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      showSuccessToast('Успішний вхід!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      showErrorToast(handleLoginError(error));
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      setLoading(true);
      try {
        const data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
        return data.data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      showSuccessToast('Реєстрація успішна!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      showErrorToast(handleRegisterError(error));
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      isRefreshing = false;
      failedQueue = [];

      const response = await fetch(buildUrl('/auth/logout'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`Logout failed: ${response.status}`);
      }
    },
    onSuccess: () => {
      useAuthStore.getState().clearUser();
      if (typeof window !== 'undefined')
        localStorage.removeItem('auth-storage');

      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['me'], null);

      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['me'] });
      queryClient.removeQueries({ queryKey: ['stories'] });
      queryClient.removeQueries({ queryKey: ['travellers'] });
    },
    onError: () => {
      useAuthStore.getState().clearUser();
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['me'], null);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (
        error?.message?.includes('401') ||
        error?.message?.includes('Сесія закінчилася')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useTravellers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['travellers', page, limit],
    queryFn: async () => {
      const data = await apiFetch(
        `/users/travellers?page=${page}&limit=${limit}`,
      );
      return data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useStories = (page: number = 1, perPage: number = 9) => {
  return useQuery({
    queryKey: ['stories', page, perPage],
    queryFn: async () => {
      return apiFetch(`/stories?page=${page}&perPage=${perPage}`);
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => getCategories(),
    staleTime: 2 * 60 * 1000,
  });
};
