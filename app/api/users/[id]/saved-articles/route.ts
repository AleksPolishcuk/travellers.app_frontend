import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../../_utils/utils';

/**
 * GET /api/users/[id]/saved-articles
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;

    const res = await api.get(`/users/${id}/saved-articles`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },

      { status: 500 },
    );
  }
}
