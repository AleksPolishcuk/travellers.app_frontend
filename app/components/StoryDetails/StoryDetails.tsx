'use client';

import { useState } from "react";
import css from "./StoryDetails.module.css";

export type StoryDetailsProps = {
  author: string;
  publishedAt: string;
  country: string;
  image: string;
  description: string;
  storyId: number;
};

export default function StoryDetails({
  author,
  publishedAt,
  country,
  image,
  description,
  storyId
}: StoryDetailsProps) {

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`/api/stories/${storyId}/save`, {
        method: "POST",
      });
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <p className={css.author}>Автор статті: {author}</p>
      <p className={css.date}>Опубліковано: {publishedAt}</p>
      <p className={css.country}>Країна: {country}</p>

      <img className={css.image} src={image} alt={country} />

      <p className={css.description}>{description}</p>

      <div className={css.saveBlock}>
        <h3>Збережіть собі історію</h3>
        <p>Вона буде доступна у вашому профілі у розділі збережене</p>

        <button onClick={handleSave} disabled={loading}>
          {loading ? "Збереження..." : saved ? "Збережено ✓" : "Зберегти"}
        </button>
      </div>
    </div>
  );
}
