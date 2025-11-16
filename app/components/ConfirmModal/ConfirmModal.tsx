'use client';
import { useEffect } from 'react';
import css from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>
        <h2 className={css.title}>{title}</h2>
        <p className={css.message}>{message}</p>
        <div className={css.buttons}>
          <button className={css.cancel} onClick={onClose}>
            {cancelButtonText}
          </button>
          <button
            className={css.confirm}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
