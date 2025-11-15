'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from '@/lib/api/clientApi';

export default function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        
        clearUser();
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading, clearUser]);

  return children;
}