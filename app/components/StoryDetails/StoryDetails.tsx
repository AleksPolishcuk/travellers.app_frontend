'use client';

import { useState } from "react";
import css from "./StoryDetails.module.css";

export type StoryDetailsProps = {
  ownerId: string;
  date: string;
  category: string;
  img: string;
  article: string;
  _id: string;
};

export default function StoryDetails({
  ownerId,
  date,
  article,
  img,
  _id,
  category,
}: StoryDetailsProps) {

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:4000/api/stories/${_id}/save`, {
        method: 'GET',
      });
      console.log(123123123);
      setSaved(true);
    } catch (err){
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <p className={css.author}>Автор статті: {ownerId}</p>
      <p className={css.date}>Опубліковано: {date}</p>
      <p className={css.country}>Країна: {category}</p>

      <img className={css.image} src={img} alt={category} />

      <p className={css.description}>{article}</p>

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
