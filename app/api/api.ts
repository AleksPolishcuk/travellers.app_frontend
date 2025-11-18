import axios, { AxiosError } from 'axios';
export type ApiError = AxiosError<{ error: string }>;
const baseURL =
  (process.env.NEXT_PUBLIC_API_URL ||
    'https://travellers-app-frontend.vercel.app') + '/api';

if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', baseURL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
