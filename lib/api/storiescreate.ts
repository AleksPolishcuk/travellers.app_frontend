import { DataGetForm } from '@/types/story';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';

export const getDataForm = async (id: string): Promise<DataGetForm> => {
  const res = await fetch(`${API_BASE_URL}stories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Failed with status: ${res.status}`);
  }

  const result = await res.json();
  return result.data;
};

export const saveStoryForm = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}stories/`, {
    method: 'POST',
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Registration failed with status: ${response.status}`,
    );
  }

  const data = await response.json();
  return data.data._id;
};
