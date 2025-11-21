const API = process.env.NEXT_PUBLIC_API_URL;

export const getProfile = async () => {
  const res = await fetch(`${API}/users/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Помилка завантаження профілю');

  return res.json();
};

export const saveBio = async (userId: string, bio: string) => {
  const res = await fetch(`${API}/users/${userId}/avatar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ description: bio }),
  });

  if (!res.ok) throw new Error('Помилка збереження опису');

  return res.json();
};

export const saveAvatar = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${API}/users/${userId}/avatar`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) throw new Error('Помилка завантаження фото');

  return res.json();
};
