import 'server-only';
import { cookies } from 'next/headers';

const API_BASE_URL = 'http://localhost:4000/api';

export const checkServerSession = async (): Promise<{ success: boolean; user?: any }> => {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!sessionId && !accessToken) {
      return { success: false };
    }

    const hasValidToken = !!(sessionId || accessToken);
    
    if (hasValidToken) {
     
      return { success: true,};
    }

    return { success: false };
  } catch (error) {
    console.error('Check server session error:', error);
    return { success: false };
  }
};


export const requireAuth = async () => {
  const session = await checkServerSession();
  if (!session.success) {
    throw new Error('Необхідна авторизація');
  }
  return session.user;
};