import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: true,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearIsAuthenticated: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.user ? true : false,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Встановлюємо isLoading: true після відновлення
          state.setLoading(true);

          if (state.user) {
            // Перевіряємо, чи user - це об'єкт User, а не API response
            const userData = state.user as unknown;

            // Функція для нормалізації id → _id
            const normalizeUserId = (obj: unknown): unknown => {
              if (obj && typeof obj === 'object') {
                const normalized = { ...obj } as Record<string, unknown>;
                // Якщо є id, але немає _id - копіюємо id в _id
                if ('id' in normalized && !('_id' in normalized)) {
                  normalized._id = normalized.id;
                }
                return normalized;
              }
              return obj;
            };

            // Функція для перевірки, чи це валідний User об'єкт
            const isValidUser = (obj: unknown): obj is User => {
              if (obj === null || typeof obj !== 'object') return false;

              // Нормалізуємо id → _id перед перевіркою
              const normalized = normalizeUserId(obj) as Record<
                string,
                unknown
              >;

              return (
                '_id' in normalized &&
                'name' in normalized &&
                typeof normalized._id === 'string' &&
                typeof normalized.name === 'string'
              );
            };

            // Нормалізуємо user з localStorage (id → _id)
            const normalizedUser = normalizeUserId(state.user) as User | null;

            // Якщо це API response з структурою { status, message, data }
            if (
              userData &&
              typeof userData === 'object' &&
              'status' in userData &&
              'data' in userData
            ) {
              const responseData = userData as { data: unknown };
              // Витягуємо user з data та нормалізуємо
              const extractedUser = normalizeUserId(responseData.data);
              if (isValidUser(extractedUser)) {
                state.user = extractedUser as User;
              } else {
                // Якщо не вдалося витягнути - очищаємо
                console.warn(
                  '⚠️ Не вдалося витягнути user з API response, очищаємо',
                );
                state.user = null;
              }
            } else if (normalizedUser && isValidUser(normalizedUser)) {
              // Нормалізуємо user (id → _id) та зберігаємо
              state.user = normalizedUser;
            } else {
              state.user = null;
            }

            // Якщо є валідний user в localStorage, встановлюємо isAuthenticated: true
            if (state.user && isValidUser(state.user)) {
              state.isAuthenticated = true;
            } else {
              state.isAuthenticated = false;
              state.user = null;
            }
          } else {
            state.isAuthenticated = false;
          }
        }
      },
    },
  ),
);

// Селектори для оптимізації ре-рендерів
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useUser = () => useAuthStore((state) => state.user);

export const useIsLoading = () => useAuthStore((state) => state.isLoading);
