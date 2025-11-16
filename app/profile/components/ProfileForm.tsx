'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './ProfileForm.module.css';

export default function ProfileForm() {
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(150);
  const [originalData, setOriginalData] = useState<{
    bio: string;
    avatar: string | null;
  }>({
    bio: '',
    avatar: null,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBio(parsed.bio || '');
        setAvatar(parsed.avatar || null);
        setCharCount(150 - (parsed.bio?.length || 0));
        setOriginalData({
          bio: parsed.bio || '',
          avatar: parsed.avatar || null,
        });
      } catch (e) {
        console.error('Error al leer localStorage:', e);
      }
    }
  }, []);

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setBio(text);
    setCharCount(150 - text.length);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const profileData = { bio, avatar };
    localStorage.setItem('profileData', JSON.stringify(profileData));
    setOriginalData({ bio, avatar });
  };

  const hasChanges =
    bio.trim() !== (originalData.bio || '').trim() ||
    avatar !== originalData.avatar;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.avatarSection}>
        <label className={styles.avatarLabel}>Аватар</label>

        <div className={styles.avatarRow}>
          <div className={styles.avatarImageWrapper}>
            <img
              src={avatar || '/Avatar-Image.jpg'}
              alt="Avatar"
              className={styles.avatarImage}
            />
          </div>

          <div className={styles.avatarActions}>
            {!avatar ? (
              <>
                <label htmlFor="avatar" className={styles.uploadButton}>
                  Завантажити фото
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className={styles.hiddenInput}
                />
              </>
            ) : (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className={styles.removeButton}
              >
                Видалити фото
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.textareaWrapper}>
        <label htmlFor="bio" className={styles.label}>
          Короткий опис
        </label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Розкажіть більше про вас"
          maxLength={150}
          value={bio}
          onChange={handleBioChange}
          className={styles.textarea}
        />
        <p className={styles.charCounter}>Лишилось символів: {charCount}</p>
      </div>

      <button
        type="submit"
        className={`${styles.submitButton} ${
          hasChanges ? styles.active : styles.inactive
        }`}
        disabled={!hasChanges}
      >
        Зберегти
      </button>
    </form>
  );
}
