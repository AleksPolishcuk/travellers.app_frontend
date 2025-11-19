import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../api';

/**
 * GET /api/users/me/saved-articles
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await api.get('/users/me/saved-articles', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error('Proxy /api/users/me/saved-articles error:', message);

    return NextResponse.json(
      {
        status: 500,
        message: 'Proxy error for /users/me/saved-articles',
        data: null,
      },
      { status: 500 },
    );
  }
}
