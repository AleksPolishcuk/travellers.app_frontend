export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  description?: string;
  onboardingCompleted: boolean;
  savedStories?: string[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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
  avatar?: string;
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

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};
