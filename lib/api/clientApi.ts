const BACKEND_URL = 'http://localhost:4000';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  onboardingCompleted: boolean;
  savedStories?: string[];
}

export interface AuthResponse {
  status: number;
  message: string;
  data: User;
}

export interface Traveller {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
}

export interface TravellersResponseData {
  travellers: Traveller[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const register = async (userData: RegisterRequest): Promise<User> => {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    // URL оновлено
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  const data: AuthResponse = await response.json();
  return data.data;
};

export const login = async (userData: LoginRequest): Promise<User> => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  return data.data;
};

export const getTravellers = async (
  page: number,
  limit: number,
): Promise<TravellersResponseData> => {
  const response = await fetch(
    `${BACKEND_URL}/users/travellers?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch travellers');
  }

  const responseJson: { data: TravellersResponseData } = await response.json();
  return responseJson.data;
};
