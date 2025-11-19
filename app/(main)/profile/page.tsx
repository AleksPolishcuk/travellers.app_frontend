// import type { Metadata } from 'next';
// import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
// import ProfilePageClient from './ProfilePageClient';
// import {
//   getMeProfileServer,
//   getUserSavedArticlesServer,
//   getServerMe,
// } from '../../../lib/api/user/serverApi';
// import type { User } from '@/types/user';
// import type { Story } from '@/types/story';

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const currentUser = await getServerMe();
//     if (!currentUser) {
//       return {
//         title: 'Мій профіль | Подорожники',
//         description:
//           'Перегляньте свої історії та збережені статті на платформі Подорожники.',
//         openGraph: {
//           title: 'Мій профіль | Подорожники',
//           description:
//             'Перегляньте свої історії та збережені статті на платформі Подорожники.',
//           url: '/profile',
//           type: 'profile',
//         },
//         twitter: {
//           card: 'summary',
//           title: 'Мій профіль | Подорожники',
//           description:
//             'Перегляньте свої історії та збережені статті на платформі Подорожники.',
//         },
//       };
//     }

//     const profileData = await getMeProfileServer();
//     if (profileData) {
//       const userName = profileData.user.name;
//       const userDescription = profileData.user.description;
//       const articlesCount = profileData.articles.length;

//       const baseDescription = userDescription
//         ? `${userDescription} | Перегляньте ${articlesCount} історій користувача ${userName}.`
//         : `Профіль користувача ${userName}. Перегляньте ${articlesCount} історій мандрівника.`;

//       const description =
//         baseDescription.length > 200
//           ? `${baseDescription.slice(0, 197)}…`
//           : baseDescription;

//       const avatarUrl = profileData.user.avatarUrl;

//       return {
//         title: `${userName} | Мій профіль | Подорожники`,
//         description,
//         openGraph: {
//           title: `${userName} | Профіль мандрівника | Подорожники`,
//           description,
//           url: '/profile',
//           siteName: 'Подорожники',
//           type: 'profile',
//           ...(avatarUrl && {
//             images: [
//               {
//                 url: avatarUrl,
//                 width: 400,
//                 height: 400,
//                 alt: userName,
//               },
//             ],
//           }),
//         },
//         twitter: {
//           card: 'summary',
//           title: `${userName} | Профіль мандрівника`,
//           description,
//           ...(avatarUrl && { images: [avatarUrl] }),
//         },
//       };
//     }
//   } catch (error) {
//     console.error('Error generating metadata for profile page:', error);
//   }

//   // Fallback metadata
//   return {
//     title: 'Мій профіль | Подорожники',
//     description:
//       'Перегляньте свої історії та збережені статті на платформі Подорожники.',
//     openGraph: {
//       title: 'Мій профіль | Подорожники',
//       description:
//         'Перегляньте свої історії та збережені статті на платформі Подорожники.',
//       url: '/profile',
//       type: 'profile',
//     },
//     twitter: {
//       card: 'summary',
//       title: 'Мій профіль | Подорожники',
//       description:
//         'Перегляньте свої історії та збережені статті на платформі Подорожники.',
//     },
//   };
// }

// export default async function ProfilePage() {
//   let currentUser: User | null = null;
//   let profileData: Awaited<ReturnType<typeof getMeProfileServer>> = null;
//   let initialSavedStories: Story[] | null = null;

//   try {
//     currentUser = await getServerMe();
//     if (currentUser) {
//       profileData = await getMeProfileServer();

//       if (profileData) {
//         try {
//           const savedArticlesData = await getUserSavedArticlesServer(
//             currentUser._id
//           );
//           initialSavedStories = savedArticlesData?.savedStories || null;
//         } catch {
//           initialSavedStories = null;
//         }

//         const userData: User = profileData.user;
//         const myStories = profileData.articles;

//         return (
//           <ProtectedRoute>
//             <ProfilePageClient
//               initialUser={userData}
//               initialMyStories={myStories}
//               initialSavedStories={initialSavedStories}
//             />
//           </ProtectedRoute>
//         );
//       }
//     }
//   } catch (error) {
//     console.error('Error loading profile on server:', error);
//   }

//   return (
//     <ProtectedRoute>
//       <ProfilePageClient
//         initialUser={null}
//         initialMyStories={[]}
//         initialSavedStories={null}
//       />
//     </ProtectedRoute>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import TravellerInfo from "../../components/TravellerInfo/TravellerInfo";
import ProfileTabs from "../../components/ProfileTabs/ProfileTabs";
import TravellersStories from "../../components/TravellersStories/TravellersStories";
import MessageNoStories from "../../components/MessageNoStories/MessageNoStories";
import Loader from "../../components/Loader/Loader";

import { User } from "@/types/user";
import { Story } from "@/types/story";
import {
  getMeProfile,
  getUserSavedArticles,
} from "@/lib/api/user/clientApi";

import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import css from "./ProfilePage.module.css";

type TabType = "saved" | "my";

interface Props {
  initialUser: User | null;
  initialMyStories: Story[];
  initialSavedStories: Story[];
}

export default function ProfilePageClient({
  initialUser,
  initialMyStories,
  initialSavedStories,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const [user, setUser] = useState<User | null>(initialUser);
  const [stories, setStories] = useState<Story[]>(initialMyStories);

  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authLoading = useAuthStore((s) => s.isLoading);
  const currentUser = useAuthStore((s) => s.user);

  const handleRemoveSavedStory = (id: string) => {
    setStories((prev) => prev.filter((s) => s._id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      if (!isAuthenticated) return;

      setIsLoading(true);

      try {
        if (activeTab === "my") {
          // Мої історії
          const data = await getMeProfile();
          setUser(data.user);
          setStories(data.articles || []);
        } else {
          // Збережені історії
          const userId = currentUser?._id || user?._id;

          if (!userId) throw new Error("Не вдалося отримати userId");

          const data = await getUserSavedArticles(userId);
          setUser(data.user);

          const saved = (data.savedStories || []).map((s) => ({
            ...s,
            isFavorite: true,
          }));

          setStories(saved);
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Не вдалося завантажити дані";
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, isAuthenticated, authLoading]);

  const getMessageProps = () => {
    if (activeTab === "my")
      return {
        text: "Ви ще нічого не публікували.",
        buttonText: "Створити історію",
        route: "/stories/create" as const,
      };

    return {
      text: "У вас ще немає збережених історій.",
      buttonText: "До історій",
      route: "/stories" as const,
    };
  };

  if (authLoading || isLoading)
    return (
      <div className="container">
        <div className={css.loaderWrapper}>
          <Loader />
        </div>
      </div>
    );

  return (
    <section className={css.profile}>
      <div className="container">
        {user && (
          <>
            <TravellerInfo
              user={user}
              priority
              className={{
                travellerInfoWraper: css.travellerInfoWraper,
                image: css.image,
                wrapper: css.wrapperContent,
                container: css.travellerContainer,
                name: css.travellerName,
                text: css.travellerText,
              }}
            />
          </>
        )}

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {stories.length === 0 ? (
          <MessageNoStories {...getMessageProps()} />
        ) : (
          <TravellersStories
            stories={stories}
            isAuthenticated={isAuthenticated}
            onRemoveSavedStory={handleRemoveSavedStory}
            isMyStory={activeTab === "my"}
          />
        )}
      </div>
    </section>
  );
}

