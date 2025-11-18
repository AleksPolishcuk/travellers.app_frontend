'use client';

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api/clientApi";
import { User } from "@/types/user";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setUser(data || null);
        }
      } catch (err: any) {
        if (isMounted) {
          setUser(null);
          setError(err.message || "Failed to load user");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, error };
}