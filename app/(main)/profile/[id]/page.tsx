
import ProfilePageClient from "../ProfilePageClient";

export default function ProfileByIdPage({ params }: { params: { id: string } }) {
  return <ProfilePageClient userId={params.id} />;
}

// app/profile/[id]/page.tsx

// import ProfilePageClient from "../ProfilePageClient";

// export default function ProfileByIdPage({ params }: { params: { id: string } }) {
//   return <ProfilePageClient userId={params.id} />;
// }
// app/profile/[id]/page.tsx

// import { getArticlesByUserClient } from '@/lib/api/user/clientApi';
// import ProfilePageClient from '@/app/(main)/profile/ProfilePageClient';

// interface Props {
//   params: {
//     id: string;
//   };
// }

// export default async function ProfileByIdPage({ params }: Props) {
//   const { id } = params;

//   // Отримуємо і user, і articles
//   const { user, articles } = await getArticlesByUserClient(id, 1, 9);

//   return (
//     <ProfilePageClient
//       user={user}
//       articles={articles.data ?? []}
//       totalArticles={articles.pagination.totalItems}
//     />
//   );
// }
// app/profile/[id]/page.tsx

// app/profile/[id]/page.tsx


