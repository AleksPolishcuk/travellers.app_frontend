import CreateStoryForm from '@/app/components/CreateStoryForm/CreateStoryForm';
import css from '@/app/components/CreateStoryForm/CreateStoryForm.module.css';

export default async function CreateStory({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div>
      <div className={css.titleContainer}>
        <h1 className="title">Редагувати історію</h1>
      </div>
      <CreateStoryForm id={id} />
    </div>
  );
}
