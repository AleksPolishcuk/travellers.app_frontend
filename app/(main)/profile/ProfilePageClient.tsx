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

