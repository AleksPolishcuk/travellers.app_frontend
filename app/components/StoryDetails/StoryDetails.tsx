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
    <section className={css.story}>
    <div className={css.wrapper}>
      <div className={css.dataDiv}>
        <div className={css.data}>
        <p className={css.author}>Автор статті: {ownerId}</p>
        <p className={css.date}>Опубліковано: {date}</p>
        </div>
        <p className={css.country}>Країна: {category}</p>
      </div>
      <img className={css.image} src={img} alt={category} />

      <div className={css.descriptionDiv}>
      <p className={css.description}>{article}</p>

      <div className={css.saveBlock}>
        <h3 className={css.saveTitle}>Збережіть собі історію</h3>
        <p className={css.saveText}>Вона буде доступна у вашому профілі у розділі збережене</p>

        <button className={css.saveBtn} onClick={handleSave} disabled={loading}>
          {loading ? "Збереження..." : saved ? "Збережено ✓" : "Зберегти"}
        </button>
      </div>
      </div>
    </div>
    </section>
  );
}
