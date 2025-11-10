import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email та пароль обов\'язкові' },
        { status: 400 }
      );
    }

    // Мок-користувач
    const user = {
      _id: 'user123',
      name: 'Тестовий Користувач',
      email,
      avatar: '',
      description: '',
      onboardingCompleted: false,
      savedStories: []
    };

    return NextResponse.json({
      status: 200,
      message: 'Успішний вхід',
      data: user
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Помилка сервера' },
      { status: 500 }
    );
  }
}