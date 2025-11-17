export const getTravellerById = async (travellerId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${travellerId}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    throw new Error('Traveller not found');
  }

  const data = await res.json();
  return data.data;
};
