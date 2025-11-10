export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  onboardingCompleted: boolean;
  savedStories?: string[];
}
