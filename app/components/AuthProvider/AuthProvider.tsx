'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCurrentUser } from '@/lib/api/clientApi';

export default function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearUser = useAuthStore((state) => state.clearUser);

  const { data: user, isLoading, error, isFetching } = useCurrentUser();

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  useEffect(() => {
    if (user) {
      setUser(user);
    } else {
      // Якщо user === null, це означає, що користувач не авторизований
      clearUser();
    }
  }, [user, setUser, clearUser]);

  return children;
}