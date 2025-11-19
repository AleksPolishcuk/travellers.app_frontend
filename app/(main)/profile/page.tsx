import type { Metadata } from 'next';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import ProfilePageClient from './ProfilePageClient';
import {
  getMeProfileServer,
  getUserSavedArticlesServer,
  getServerMe,
} from '@/lib/api/user/serverApi';
import type { User } from '@/types/user';
import type { Story } from '@/types/story';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const currentUser = await getServerMe();
    if (!currentUser) {
      return {
        title: 'Мій профіль | Подорожники',
        description:
          'Перегляньте свої історії та збережені статті на платформі Подорожники.',
        openGraph: {
          title: 'Мій профіль | Подорожники',
          description:
            'Перегляньте свої історії та збережені статті на платформі Подорожники.',
          url: '/profile',
          type: 'profile',
        },
        twitter: {
          card: 'summary',
          title: 'Мій профіль | Подорожники',
          description:
            'Перегляньте свої історії та збережені статті на платформі Подорожники.',
        },
      };
    }

    const profileData = await getMeProfileServer();
    if (profileData) {
      const userName = profileData.user.name;
      const userDescription = profileData.user.description;
      const articlesCount = profileData.articles.length;

      const baseDescription = userDescription
        ? `${userDescription} | Перегляньте ${articlesCount} історій користувача ${userName}.`
        : `Профіль користувача ${userName}. Перегляньте ${articlesCount} історій мандрівника.`;

      const description =
        baseDescription.length > 200
          ? `${baseDescription.slice(0, 197)}…`
          : baseDescription;

      const avatarUrl = profileData.user.avatarUrl;

      return {
        title: `${userName} | Мій профіль | Подорожники`,
        description,
        openGraph: {
          title: `${userName} | Профіль мандрівника | Подорожники`,
          description,
          url: '/profile',
          siteName: 'Подорожники',
          type: 'profile',
          ...(avatarUrl && {
            images: [
              {
                url: avatarUrl,
                width: 400,
                height: 400,
                alt: userName,
              },
            ],
          }),
        },
        twitter: {
          card: 'summary',
          title: `${userName} | Профіль мандрівника`,
          description,
          ...(avatarUrl && { images: [avatarUrl] }),
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata for profile page:', error);
  }

  // Fallback metadata
  return {
    title: 'Мій профіль | Подорожники',
    description:
      'Перегляньте свої історії та збережені статті на платформі Подорожники.',
    openGraph: {
      title: 'Мій профіль | Подорожники',
      description:
        'Перегляньте свої історії та збережені статті на платформі Подорожники.',
      url: '/profile',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: 'Мій профіль | Подорожники',
      description:
        'Перегляньте свої історії та збережені статті на платформі Подорожники.',
    },
  };
}

export default async function ProfilePage() {
  let currentUser: User | null = null;
  let profileData: Awaited<ReturnType<typeof getMeProfileServer>> = null;
  let initialSavedStories: Story[] | null = null;

  try {
    currentUser = await getServerMe();
    if (currentUser) {
      profileData = await getMeProfileServer();

      if (profileData) {
        try {
          const savedArticlesData = await getUserSavedArticlesServer(
            currentUser._id
          );
          initialSavedStories = savedArticlesData?.savedStories || null;
        } catch {
          initialSavedStories = null;
        }

        const userData: User = profileData.user;
        const myStories = profileData.articles;

        return (
          <ProtectedRoute>
            <ProfilePageClient
              initialUser={userData}
              initialMyStories={myStories}
              initialSavedStories={initialSavedStories}
            />
          </ProtectedRoute>
        );
      }
    }
  } catch (error) {
    console.error('Error loading profile on server:', error);
  }

  return (
    <ProtectedRoute>
      <ProfilePageClient
        initialUser={null}
        initialMyStories={[]}
        initialSavedStories={null}
      />
    </ProtectedRoute>
  );
}