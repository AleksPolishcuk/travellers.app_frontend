import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Некоректний формат email')
    .required('Email обов\'язковий'),
  password: Yup.string()
    .min(8, 'Пароль повинен містити мінімум 8 символів')
    .required('Пароль обов\'язковий'),
});

export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Ім\'я повинно містити мінімум 2 символи')
    .required('Ім\'я обов\'язкове'),
  email: Yup.string()
    .email('Некоректний формат email')
    .required('Email обов\'язковий'),
  password: Yup.string()
    .min(8, 'Пароль повинен містити мінімум 8 символів')
    .required('Пароль обов\'язковий'),
});