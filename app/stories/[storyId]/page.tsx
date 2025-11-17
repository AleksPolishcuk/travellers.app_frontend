import PopularList from "@/app/components/Popular/Popular";
import StoryDetails from "@/app/components/StoryDetails/StoryDetails";

async function getStory(id: string) {
    const res = await fetch(`${process.env.API_URL}/stories/${id}`, {
      cache: "no-store",
    });
  
    if (!res.ok) throw new Error("Failed to load story");
    return res.json();
  }
  
  export default async function StoryPage(props: { params: Promise<{ storyId: string }> }) {
    const { storyId } = await props.params;
  
    let story;
  
    try {
      story = await getStory(storyId);
    } catch (err) {
      return <p>Помилка завантаження історії.</p>;
    }
  
    return (
      <div>
        <h1>{story.title}</h1>
  
        <StoryDetails
          storyId={story.id}
          author={story.owner.name}
          publishedAt={story.publishedAt}
          country={story.country}
          image={story.image}
          description={story.fullDescription}
        />
  
        <PopularList stories={story.popular} />
      </div>
    );
  }

