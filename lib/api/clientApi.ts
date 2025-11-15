
import { User, RegisterRequest, LoginRequest, AuthResponse, Traveller, TravellersResponseData } from '@/types/user';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

//todo=======================================

export const getStories = async (
  page: number = 1,
  perPage: number = 9,
): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URL}/stories?page=${page}&perPage=${perPage}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch stories');
  }

  const responseData = await response.json();
  return responseData; //  повертаємо всю відповідь, не тільки data
};

// export type StoryListResponse = {
//   data: Story[];
//   page?: number;
//   perPage?: number;
//   totalPages?: number;
// };
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// export const getStories = async (page = 1, perPage = 3): Promise<Story[]> => {
//   const res = await api.get<StoryListResponse>(`/stories?page=${page}&perPage=${perPage}`);
  

//   return res.data.data;
// };




//todo==============================


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
