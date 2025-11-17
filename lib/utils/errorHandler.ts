
import { toast } from 'react-toastify';

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Сталася невідома помилка';
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};