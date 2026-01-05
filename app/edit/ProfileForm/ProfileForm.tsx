'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './ProfileForm.module.css';
import { getProfile, saveBio, saveAvatar } from '@/lib/api/profileApi';
import { useRouter } from 'next/navigation';

export default function ProfileForm() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(150);
  const [originalData, setOriginalData] = useState({
    bio: '',
    avatar: null as string | null,
  });

  useEffect(() => {
    async function load() {
      const result = await getProfile();
      const data = result.data;
      console.log('result', data);

      setUserId(data._id);
      setBio(data.description || '');
      setAvatarPreview(data.avatarUrl || null);
      setOriginalData({
        bio: data.description || '',
        avatar: data.avatarUrl || null,
      });

      setCharCount(150 - (data.description?.length || 0));
    }

    load();
  }, []);

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setBio(text);
    setCharCount(150 - text.length);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (avatarFile) {
      await saveAvatar(userId, avatarFile);
    }

    if (bio.trim() !== originalData.bio.trim()) {
      await saveBio(userId, bio);
    }

    setOriginalData({ bio, avatar: avatarPreview });
    router.push('/profile');
  };

  const hasChanges =
    bio.trim() !== originalData.bio.trim() ||
    avatarPreview !== originalData.avatar;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.avatarSection}>
        <label className={styles.avatarLabel}>Аватар</label>

        <div className={styles.avatarRow}>
          <div className={styles.avatarImageWrapper}>
            <img
              src={avatarPreview || '/Avatar-Image.jpg'}
              alt="Avatar"
              className={styles.avatarImage}
            />
          </div>

          <div className={styles.avatarActions}>
            {!avatarPreview ? (
              <>
                <label htmlFor="avatar" className={styles.uploadButton}>
                  Завантажити фото
                </label>
                <input
                  id="avatar"
                  type="file"
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
        <label className={styles.label}>Короткий опис</label>

        <textarea
          value={bio}
          maxLength={150}
          placeholder="Розкажіть більше про вас"
          onChange={handleBioChange}
          className={styles.textarea}
        />

        <p className={styles.charCounter}>Лишилось символів: {charCount}</p>
      </div>

      <button
        type="submit"
        disabled={!hasChanges}
        className={`${styles.submitButton} ${
          hasChanges ? styles.active : styles.inactive
        }`}
      >
        Зберегти
      </button>
    </form>
  );
}
