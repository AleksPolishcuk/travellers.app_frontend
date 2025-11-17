import { User, RegisterRequest, LoginRequest, TravellersResponseData } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '@/lib/utils/errorHandler';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Базова fetch функція
const apiFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        try {
          const text = await response.text();
          errorMessage = text || errorMessage;
        } catch {
          // Якщо навіть текст не вдалося отримати, використовуємо статус
        }
      }
      
      // Спеціальна обробка для 404 (користувач не знайдений)
      if (response.status === 404) {
        throw new Error('Користувача не знайдено.');
      }

      // Спеціальна обробка для 401 (неавторизований)
      if (response.status === 401) {
        throw new Error('Необхідна авторизація');
      }
      
      throw new Error(errorMessage);
    }

    // Обробка успішної відповіді
    const responseData = await response.json();
    return responseData;

  } catch (error: any) {
    // Обробка помилок мережі
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Помилка мережі. Перевірте підключення до інтернету.');
    }
    throw error;
  }
};

// Функція для отримання категорій
export const getCategories = async (
  page: number = 1,
  perPage: number = 9,
): Promise<any> => {
  const data = await apiFetch(`/categories?page=${page}&perPage=${perPage}`, {
    method: 'GET',
  });
  return data;
};

// Спеціальна функція для logout
const logoutApi = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (response.status === 204) {
        return;
      }
    }
    
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return;
  }

  // Спроба обробити JSON, якщо він є
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      await response.json();
    }
  } catch {
    // Ігноруємо помилки парсингу для logout
  }
};

// Базові функції для прямого використання
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

export const logout = async (): Promise<void> => {
  await logoutApi();
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await apiFetch('/users/me');
    return data.data;
  } catch (error: any) {
    // Якщо помилка авторизації, повертаємо null замість викидання помилки
    if (error.message.includes('access token') || 
        error.message.includes('access token in cookies') ||
        error.message.includes('Необхідна авторизація') ||
        error.message.includes('401')) {
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
): Promise<any> => {
  const data = await apiFetch(`/stories?page=${page}&perPage=${perPage}`);
  return data;
};

// Функції для обробки помилок
const handleLoginError = (error: any): string => {
  const errorMessage = error.message || 'Помилка входу';

  if (errorMessage.includes('user not found') || 
      errorMessage.includes('користувача не знайдено') ||
      errorMessage.includes('User not found') ||
      errorMessage.toLowerCase().includes('not found') ||
      errorMessage.includes('404') ||
      errorMessage.includes('неправильний email або пароль')) {
    return 'Користувача не знайдено.';
  }
  
  if (errorMessage.includes('password') || 
      errorMessage.includes('пароль') ||
      errorMessage.includes('invalid password') ||
      errorMessage.includes('невірний пароль')) {
    return 'Невірний email або пароль.';
  }
  
  if (errorMessage.includes('email') || errorMessage.includes('пошта')) {
    return 'Невірний формат email.';
  }
  
  if (errorMessage.includes('Помилка мережі') || errorMessage.includes('Failed to fetch')) {
    return 'Помилка мережі. Перевірте підключення до інтернету.';
  }
  
  return 'Сталася невідома помилка. Спробуйте ще раз.';
};

const handleRegisterError = (error: any): string => {
  const errorMessage = error.message || 'Помилка реєстрації';
  
  // Перевіряємо, чи email вже використовується
  if (errorMessage.includes('email already exists') || 
      errorMessage.includes('email вже використовується') ||
      errorMessage.includes('user already exists') ||
      errorMessage.includes('користувач вже існує')) {
    return 'Користувач з таким email вже існує.';
  }
  
  return errorMessage;
};

// React Query hooks
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
      } catch (error: any) {
        console.error('Login API error:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      showSuccessToast('Успішний вхід!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.log('Login mutation error:', error);
      const userFriendlyMessage = handleLoginError(error);
      showErrorToast(userFriendlyMessage);
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
    },
    onError: (error: any) => {
      const userFriendlyMessage = handleRegisterError(error);
      showErrorToast(userFriendlyMessage);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setLoading = useAuthStore((state) => state.setLoading);
  
  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      try {
        await logoutApi();
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      useAuthStore.getState().clearUser();
      showSuccessToast('Ви вийшли з системи');
      queryClient.clear();
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'Помилка виходу');
      useAuthStore.getState().clearUser();
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await getCurrentUser();
        return user;
      } catch (error: any) {
        // Якщо помилка авторизації, повертаємо null
        if (error.message.includes('access token') || 
            error.message.includes('access token in cookies') ||
            error.message.includes('Необхідна авторизація') ||
            error.message.includes('401')) {
          return null;
        }
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Не повторюємо запит при помилках авторизації
      if (error.message.includes('access token') || 
          error.message.includes('access token in cookies') ||
          error.message.includes('Необхідна авторизація') ||
          error.message.includes('401')) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useTravellers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['travellers', page, limit],
    queryFn: async () => {
      const data = await apiFetch(`/users/travellers?page=${page}&limit=${limit}`);
      return data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useStories = (page: number = 1, perPage: number = 9) => {
  return useQuery({
    queryKey: ['stories', page, perPage],
    queryFn: async () => {
      const data = await apiFetch(`/stories?page=${page}&perPage=${perPage}`);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCategories = (page: number = 1, perPage: number = 9) => {
  return useQuery({
    queryKey: ['categories', page, perPage],
    queryFn: async () => {
      const data = await getCategories(page, perPage);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
};