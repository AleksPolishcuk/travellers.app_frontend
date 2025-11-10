'use client';

import { FC } from 'react';
import css from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className={css.overlay}>
      <div className={css.modal}>
        <h2 className={css.title}>Підтвердьте вихід</h2>
        <p className={css.message}>Ви дійсно хочете вийти з акаунту?</p>
        <div className={css.buttons}>
          <button className={css.cancel} onClick={onClose}>
            Відміна
          </button>
          <button
            className={css.confirm}
            onClick={() => {
              onConfirm();
            }}
          >
            Вихід
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
