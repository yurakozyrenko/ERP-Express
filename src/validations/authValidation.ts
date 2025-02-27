import { body } from 'express-validator';

export const signupValidation = [
  body('id').custom((value) => {
    const isEmail = /\S+@\S+\.\S+/.test(value);
    const isPhone = /^[0-9]{10,15}$/.test(value);
    if (!isEmail && !isPhone) {
      throw new Error('Введите корректный email или номер телефона');
    }
    return true;
  }),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
];
