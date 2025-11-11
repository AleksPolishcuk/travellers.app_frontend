import CreateStoryForm from '@/app/components/CreateStoryForm/CreateStoryForm';

export default function CreateStory() {
  return (
    <div>
      <div className="title-container">
        <h1 className="title">Створити нову історію</h1>
      </div>
      <CreateStoryForm />
    </div>
  );
}
