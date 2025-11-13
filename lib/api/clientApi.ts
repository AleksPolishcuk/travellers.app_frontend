import { User, RegisterRequest, LoginRequest, AuthResponse, Traveller, TravellersResponseData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const register = async (userData: RegisterRequest): Promise<User> => {
  
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
  }

  const data: AuthResponse = await response.json();
  return data.data;
};

export const login = async (userData: LoginRequest): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include', 
  });


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Login failed with status: ${response.status}`);
  }

  const data: AuthResponse = await response.json();
  return data.data;
};

export const getTravellers = async (
  page: number,
  limit: number,
): Promise<TravellersResponseData> => {
  const response = await fetch(
    `${API_BASE_URL}/users/travellers?page=${page}&limit=${limit}`,
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
