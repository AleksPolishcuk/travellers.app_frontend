'use client';
import css from '@/app/components/CreateStoryForm/CreateStoryForm.module.css';

export default function CreateStoryForm() {
  return (
    <div>
      <div className="form-story">
        <div className="form-photo-container">
          <div className="title-container">
            <p className="title-photo">Обкладинка статті</p>
          </div>
          <div className="photo-container"></div>
          <div className="button-add-container">
            <button className="button-add-photo" id="btn-add-photo">
              Завантажити фото
            </button>
          </div>
        </div>
        <div className="form-container">
          <div className="inputs-container">
            <div className="input-container">
              <label htmlFor="input-title-story" className="label-input">
                Загаловок
              </label>
              <input
                type="text"
                id="input-title-story"
                name="input-title-story"
                placeholder="Введіть заголовок історії"
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="input-category-story" className="label-input">
                Категорія
              </label>
              <select
                id="input-category-story"
                name="input-category-story"
                aria-placeholder="Категорія"
                required
              >
                <option value="123">123</option>
                <option value="123">123</option>
                <option value="123">123</option>
                <option value="123">123</option>
                <option value="123">123</option>
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="input-short-desc-story" className="label-input">
                Короткий опис
              </label>
              <input
                type="textarea"
                id="input-short-desc-story"
                name="input-short-desc-story"
                placeholder="Введіть короткий опис історії"
                required
              />
              <p className="left-symbols" id="left-smb">
                Лишилось символів: 61
              </p>
            </div>
            <div className="input-container">
              <label htmlFor="input-desc-story" className="label-input">
                Текст історії
              </label>
              <input
                type="textarea"
                id="input-desc-story"
                name="input-desc-story"
                placeholder="Ваша історія тут"
                required
              />
            </div>
          </div>
          <div className="buttons-container">
            <button className="button-form-add" disabled>
              Зберегти
            </button>
            <button className="button-form-cancel" disabled>
              Відмінити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
