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
    avatar?: string;
    description?: string;
    onboardingCompleted: boolean;
  }
  
  export interface AuthResponse {
    status: number;
    message: string;
    data: User;
  }
  
  export const register = async (userData: RegisterRequest): Promise<User> => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
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
    const response = await fetch('http://localhost:3000/api/auth/login', {
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