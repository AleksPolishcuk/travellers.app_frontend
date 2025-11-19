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
  isConfirmLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  isConfirmLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirmLoading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isConfirmLoading]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    console.log('🔄 ConfirmModal: Confirm button clicked');
    onConfirm();
  };

  const handleOverlayClick = () => {
    if (!isConfirmLoading) {
      onClose();
    }
  };

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
          disabled={isConfirmLoading}
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>
        <h2 className={css.title}>{title}</h2>
        <p className={css.message}>{message}</p>
        <div className={css.buttons}>
          <button 
            className={css.cancel} 
            onClick={onClose}
            disabled={isConfirmLoading}
          >
            {cancelButtonText}
          </button>
          <button
            className={css.confirm}
            onClick={handleConfirm}
            disabled={isConfirmLoading}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}