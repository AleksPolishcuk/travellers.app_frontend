import PopularList from '@/app/components/Popular/Popular';
import StoryDetails from '@/app/components/StoryDetails/StoryDetails';
import { NEXT_PUBLIC_API_URL } from '@/constants';
import css from "./page.module.css";


async function getStory(id: string) {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/stories/${id}`, {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to load story');
  return res.json();
}

export default async function StoryPage(props: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await props.params;

  let response;

  try {
    response = await getStory(storyId);
  } catch (err) {
    return <p>Помилка завантаження історії.</p>;
  }

  if (!response.data) {
    console.error('No data in response:', response);
    return <p>Дані історії не знайдені.</p>;
  }

  const story = response.data;

  return (
    <div className={css.story}>
      <h1 className={css.title}>{story.data.title}</h1>

      <StoryDetails
        _id={story._id}  
        ownerId={story.ownerId.name} 
        date={story.date}
        category={story.category.name} 
        img={story.img}
        article={story.article}
      />

      <PopularList />
    </div>
  );
}