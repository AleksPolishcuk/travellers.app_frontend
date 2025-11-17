import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

/**
 * Клиєнтський API instance
 */
export const api = axios.create({
  baseURL: '/api', // працює з Next.js API routes
  withCredentials: true, // щоб автоматично відправлялись cookies
  headers: { 'Content-Type': 'application/json' },
});

// -------------------------
// Refresh Token Queue
// -------------------------

let isRefreshing = false;
let queue: Array<{
  resolve: (token?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: unknown = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

// -------------------------
// REQUEST INTERCEPTOR
// -------------------------

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error),
);

// -------------------------
// RESPONSE INTERCEPTOR
// -------------------------

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!original || original._retry) return Promise.reject(error);

    // Якщо 401 → пробуємо refresh
    if (error.response?.status === 401) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(original));
      }

      isRefreshing = true;

      try {
        await api.post('/auth/refresh', {});
        processQueue(null);
        return api(original);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
export async function addStoryToFavorites(storyId: string): Promise<void> {
  await api.post(`/users/me/saved/${storyId}`);
}

export async function removeStoryFromFavorites(storyId: string): Promise<void> {
  await api.delete(`/users/me/saved/${storyId}`);
}
