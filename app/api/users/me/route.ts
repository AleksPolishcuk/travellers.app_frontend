import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

/**
 * GET /api/users/me
 * Отримати дані поточного користувача
 */
export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await api.get('/users/me', {
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

    const message = error instanceof Error ? error.message : 'Unknown error';
    logErrorResponse({ message });

    return NextResponse.json(
      { error: 'Internal Server Error', details: message },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/users/me
 * Оновити профіль поточного користувача
 */
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const formData = await request.formData();

    // Логування для діагностики
    console.log('Received formData fields:', Array.from(formData.keys()));

    // Використовуємо form-data пакет для Node.js середовища
    const FormDataClass = (await import('form-data')).default;
    const remoteFormData = new FormDataClass();

    // Копіюємо всі поля з FormData
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        // Текстові поля
        remoteFormData.append(key, value);
        console.log(`Added text field: ${key} = ${value}`);
      } else {
        // value тут — файл (File у Web API)
        const buffer = Buffer.from(await value.arrayBuffer());
        remoteFormData.append(key, buffer, {
          filename: value.name ?? 'file',
          contentType: value.type ?? 'application/octet-stream',
        });
        console.log(
          `Added file field: ${key}, size: ${buffer.length}, type: ${value.type}`,
        );
      }
    }

    const res = await api.patch('/users/me', remoteFormData, {
      headers: {
        Cookie: cookieStore.toString(),
        // Додаємо правильні headers для multipart/form-data
        ...remoteFormData.getHeaders(),
      },
    });

    // Бекенд повертає: { status: 200, message: "...", data: { ... } }
    // Повертаємо всю відповідь як є
    return NextResponse.json(res.data, {
      status: res.status || res.data?.status || 200,
    });
  } catch (error) {
    console.error('PATCH /api/users/me error:', error);

    if (isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error message:', error.message);

      logErrorResponse(error.response?.data);

      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
          status: error.response?.status,
        },
        { status: error.response?.status || 500 },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Non-axios error:', errorMessage);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }

    logErrorResponse({ message: errorMessage });

    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 },
    );
  }
}
