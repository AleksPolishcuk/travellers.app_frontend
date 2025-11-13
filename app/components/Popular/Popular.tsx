'use client';

import css from './Popular.module.css';
import { Story } from '@/lib/api/storyApi';
import { useQueryClient } from "@tanstack/react-query";

type PopularListProps = {
    stories: Story[];
}

 const PopularList = ({stories}: PopularListProps) => {
const queryClient = useQueryClient();
    return (
        <ul className={css.list}>
{stories.map((story) => (
  <li key={story.id} className={css.listItem}>
    <img className={css.listImg} src={story.img} alt={story.title}  />
    <p className={css.listCategory}>{story.category.name}</p>
    <h3 className={css.listTitle}>{story.title}</h3>
    <p className={css.listArticle}>{story.article}</p>
    <div className={css.user}>
    <img className={css.userImg} src={story.ownerId.avatarUrl}/>
    <h4 className={css.userName}>{story.ownerId.name}</h4>
    <p className={css.userCount}>{story.ownerId.articlesAmount}</p>
    </div>
  </li>
))}
        </ul>
      );
}
export default PopularList



// 'use client';
// import React, { useEffect, useState } from 'react';
// import css from './Popular.module.css';

// const Popular = () => {
//   const [stories, setStories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Функція для отримання популярних історій
//   const fetchPopularStories = async () => {
//     try {
//       const response = await fetch(
    //     'http://localhost:4000/travellers.travellers?page=1&perPage=3&sortBy=favoriteCount&sortOrder=desc'
    //   );
//       if (!response.ok) throw new Error('Failed to fetch stories');
//       const data = await response.json();
//       setStories(data.data); // з getAllStories повертається { data, page, perPage, ... }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPopularStories();
//   }, []);

//   if (loading) return <p>Loading popular stories...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className={css.popular}>
//       <h2>Популярні історії</h2>
//       <ul className={css.list}>
//         {stories.map((story) => (
//           <li key={story._id} className={css.listItem}>
            // <img
            //   className={css.popularImg}
            //   src={story.img || '/default-image.png'}
            //   alt={story.title}
            // />
            // <p className={css.popularText}>{story.category}</p>
            // <h3 className={css.title}>{story.title}</h3>
            // <p className={css.content}>{story.article}</p>
//             <img
//               className={css.avatar}
//               src={story.ownerAvatar || '/default-avatar.png'}
//               alt="Author avatar"
//             />
//             <button className={css.button}>Переглянути статтю</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Popular;



// <div className={css.popular}>{item.title}
         /* <h2>Популярні історії</h2>
        <ul className={css.list}>

  <li className={css.listItem}>
    <div className={css.popularCard}>
    <img className={css.popularImg} src="/moonlit-coral-reef.png" alt='img title'/>
    </div>
    <p className={css.popularText}>Story country</p>
    <h3 className={css.title}>Story title</h3>
    <p className={css.content}>Story content</p>
<img className={css.avatar} src="/moonlit-coral-reef.png"/>
      <button className={css.button}>Переглянути статтю</button>
  </li>
</ul> */
// </div>;