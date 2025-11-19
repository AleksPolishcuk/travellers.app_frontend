import PopularList from '@/app/components/Popular/Popular';
import StoryDetails from '@/app/components/StoryDetails/StoryDetails';
import css from "./page.module.css";

async function getStory(id: string) {
  const res = await fetch(`${process.env.API_URL}/stories/${id}`, {
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

  let story;

  try {
    story = await getStory(storyId);
  } catch (err) {
    return <p>Помилка завантаження історії.</p>;
  }

  return (
    <div className={css.story}>
      <h1 className={css.title}>{story.data.title}</h1>

      <StoryDetails
        _id={story.data.id}
        ownerId={story.data.ownerId}
        date={story.data.date}
        category={story.data.category}
        img={story.data.img}
        article={story.data.article}
      />

      <PopularList />
    </div>
  );
}
