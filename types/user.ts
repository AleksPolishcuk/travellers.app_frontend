export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    description?: string;
    onboardingCompleted: boolean;
    savedStories?: string[];
    
  }