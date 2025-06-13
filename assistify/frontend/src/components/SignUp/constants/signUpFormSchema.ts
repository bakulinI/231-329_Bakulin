import { passwordSchema } from '@/common';
import * as z from 'zod';
export const signUpFormSchema = z.object({
  username: z.string(),
  email: z.string().email().toLowerCase(),
  password: passwordSchema,
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
