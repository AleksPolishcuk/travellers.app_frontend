'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCurrentUser, refreshToken } from '@/lib/api/clientApi';

export default function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearUser = useAuthStore((state) => state.clearUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (error && isAuthenticated) {
      clearUser();
      localStorage.removeItem('auth-storage');
    }
  }, [user, error, setUser, clearUser, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {}
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return children;
}