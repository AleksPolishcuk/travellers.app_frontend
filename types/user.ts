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

  type AuthStore = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
  };