'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getDataForm, saveStoryForm } from '@/lib/api/storiescreate';
import {
  DataGetForm,
  CreateStoryFormProps,
  StoryFormValues,
} from '@/types/story';
import css from './CreateStoryForm.module.css';

export default function CreateStoryForm({ id }: CreateStoryFormProps) {
  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<StoryFormValues>({
    title: '',
    category: '',
    article: '',
    fullText: '',
    img: '',
  });
  const [previewImg, setPreviewImg] = useState<string>(
    '/Placeholder-story-create.png',
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:4000/api/stories/categories');
        const data = await res.json();
        setCategories(data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);
  // Загрузка данных если редактирование
  useEffect(() => {
    if (!id || categories.length === 0) return;

    async function loadStory() {
      try {
        const data: DataGetForm = await getDataForm(id!);

        const selectedCategoryId =
          typeof data.category === 'string'
            ? data.category
            : data.category.$oid;

        const selectedCategory = categories.find(
          (cat) => cat._id === selectedCategoryId,
        );

        setInitialValues({
          title: data.title || '',
          category: selectedCategory?._id || '',
          article: data.article || '',
          fullText: data.fullText || '',
          img: data.img || '',
        });

        setPreviewImg(data.img || '/Placeholder-story-create.png');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadStory();
  }, [id, categories]);
  if (!isLoaded) return <p>Завантаження...89</p>;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Заголовок обовʼязковий'),
    category: Yup.string().required('Оберіть категорію'),
    article: Yup.string().required('Короткий опис обовʼязковий'),
    fullText: Yup.string().required('Текст історії обовʼязковий'),
    img: Yup.mixed(),
  });

  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue('img', file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values: StoryFormValues) => {
    try {
      setSubmitError('');

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category', values.category);
      formData.append('article', values.article);
      formData.append('fullText', values.fullText);
      if (values.img instanceof File) {
        formData.append('img', values.img);
      }

      const storyId = await saveStoryForm(formData);
      router.push(`/stories/${storyId}`);
    } catch (err) {
      console.error(err);
      setSubmitError('Помилка збереження');
    }
  };

  return (
    <div className="form-story">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isValid, setFieldValue }) => (
          <Form>
            <div className={css.formPhotoContainer}>
              <p className="title-photo">Обкладинка статті</p>
              <div className={css.photoContainer}>
                <img src={previewImg} alt="story" />
              </div>
              <label htmlFor="fileInput" className={css.fileButton}>
                Завантажити фото
              </label>

              <input
                id="fileInput"
                type="file"
                className={css.fileInput}
                accept="image/*"
                onChange={(e) => handleImgChange(e, setFieldValue)}
              />
              <ErrorMessage name="img" component="div" className={css.error} />
            </div>
            <div className={css.formContainer}>
              <div className={css.inputContainer}>
                <label>Заголовок</label>
                <Field
                  name="title"
                  placeholder="Введіть заголовок історії"
                  className={css.inputForm}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className={css.error}
                />
              </div>

              <div className={css.inputContainer}>
                <label>Категорія</label>
                <Field
                  as="select"
                  name="category"
                  placeholder="Категорія"
                  className={css.inputForm}
                >
                  <option value="">Категорія</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className={css.error}
                />
              </div>

              <div className={css.inputContainer}>
                <label>Короткий опис</label>
                <Field
                  as="textarea"
                  name="article"
                  rows=""
                  placeholder="Введіть короткий опис історії"
                  className={css.inputFormTextArea}
                  onInput={autoResizeTextarea}
                />
                <ErrorMessage
                  name="article"
                  component="div"
                  className={css.error}
                />
              </div>

              <div className={css.inputContainer}>
                <label>Текст історії</label>
                <Field
                  as="textarea"
                  name="fullText"
                  placeholder="Ваша історія тут"
                  className={css.inputFormTextArea}
                  onInput={autoResizeTextarea}
                />
                <ErrorMessage
                  name="fullText"
                  component="div"
                  className={css.error}
                />
              </div>
            </div>

            {submitError && <div className="submit-error">{submitError}</div>}

            <div className={css.buttonsContainer}>
              <button
                type="submit"
                disabled={!isValid}
                className={css.buttonForm}
              >
                {id ? 'Оновити' : 'Зберегти'}
              </button>
              <button
                type="button"
                className={css.buttonFormBack}
                onClick={() => router.push(`/stories/${id}`)}
              >
                Відмінити
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
