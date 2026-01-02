import { apiFetch } from '@/lib/api/clientApi';
import type { Story } from '@/types/story';

type ApiEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

type StoriesListBackend = {
  data: Story[]; // <- масив лежить тут
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ProfileStoriesResponse = {
  items: Story[];
  pagination: {
    page: number;
    perPage: number;
    hasNextPage: boolean;
  };
};

const mapStoriesList = (
  payload: StoriesListBackend,
): ProfileStoriesResponse => ({
  items: payload.data ?? [],
  pagination: {
    page: payload.page,
    perPage: payload.perPage,
    hasNextPage: payload.hasNextPage,
  },
});

export async function fetchMySavedStories(params: {
  page: number;
  perPage: number;
}) {
  const { page, perPage } = params;

  // бек: GET /api/stories/saved?page&perPage
  const res = (await apiFetch(
    `/stories/saved?page=${page}&perPage=${perPage}`,
    { method: 'GET' },
  )) as ApiEnvelope<StoriesListBackend>;

  return mapStoriesList(res.data);
}

export async function fetchMyOwnStories(params: {
  page: number;
  perPage: number;
  ownerId: string;
}) {
  const { page, perPage, ownerId } = params;

  // бек: GET /api/stories?page&perPage&ownerId=...
  const res = (await apiFetch(
    `/stories?page=${page}&perPage=${perPage}&ownerId=${ownerId}`,
    { method: 'GET' },
  )) as ApiEnvelope<StoriesListBackend>;

  return mapStoriesList(res.data);
}
