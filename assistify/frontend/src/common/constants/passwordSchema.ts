import * as z from 'zod';

export const passwordSchema = z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gi, {
  message: 'Пароль должен содержать 8 символов или более, включая 1 цифру.',
});
