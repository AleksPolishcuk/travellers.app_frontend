import CreateStoryForm from '@/app/components/CreateStoryForm/CreateStoryForm';
import css from '@/app/components/CreateStoryForm/CreateStoryForm.module.css';

export default function CreateStory() {
  return (
    <div>
      <div className={css.titleContainer}>
        <h1 className="title">Створити нову історію</h1>
      </div>
      <CreateStoryForm />
    </div>
  );
}
