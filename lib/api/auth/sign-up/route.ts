import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Валідація
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Всі поля обов\'язкові' },
        { status: 400 }
      );
    }

    // Мок-користувач
    const user = {
      _id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: '',
      description: '',
      onboardingCompleted: false,
      savedStories: []
    };

    return NextResponse.json({
      status: 201,
      message: 'Користувача успішно зареєстровано',
      data: user
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Помилка сервера' },
      { status: 500 }
    );
  }
}