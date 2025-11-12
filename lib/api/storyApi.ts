//?======================================
// export type Story = {
//     id: string;
//     img: string;
//     title: string;
//     article: string;
//     category: string;
//     ownerId: string;
//     date: string;
//     favoriteCount: number;
//   };

//   export type StoryListResponse = {
//     story: Story[];
//     total: number;
//   };

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

//   export const getStories = async (): Promise<StoryListResponse> => {
//     const res = await fetch(`${API_URL}/stories`, {
//       cache: "no-store", // щоб не кешувалось у Next.js SSR
//     });

//     if (!res.ok) {
//       throw new Error(`Failed to fetch stories: ${res.statusText}`);
//     }

//     return res.json();
//   };
//?=====================================

import axios from 'axios';

export type Story = {
  id: string;
  img: string;
  title: string;
  article: string;
  category: { name: string };
  ownerId: { avatarUrl: string; name: string; articlesAmount: number };
  date: string;
  favoriteCount: number;
};

export type StoryListResponse = {
  story: Story[];
  total: number;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getStories = async () => {
  const res = await api.get('/stories');
  return res.data.data.data;
};
