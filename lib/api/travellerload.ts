import { NEXT_PUBLIC_API_URL } from '@/constants';

const API_BASE_URL = NEXT_PUBLIC_API_URL;

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

      if (response.status === 404) {
        throw new Error('Користувача не знайдено.');
      }

      if (response.status === 401) {
        throw new Error('Необхідна авторизація');
      }

      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    ) {
      throw new Error('Помилка мережі. Перевірте підключення до інтернету.');
    }
    throw error;
  }
};

export const getTravellerById = async (travellerId: string) => {
  const data = await apiFetch(`/users/${travellerId}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  return data;
};
