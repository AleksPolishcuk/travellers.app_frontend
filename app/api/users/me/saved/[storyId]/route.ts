import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '../../../../api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const { storyId } = await params;

    const res = await api.post(`/users/me/saved/${storyId}`, null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const cookieStore = cookies();
    const { storyId } = await params;

    const res = await api.delete(`/users/me/saved/${storyId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
