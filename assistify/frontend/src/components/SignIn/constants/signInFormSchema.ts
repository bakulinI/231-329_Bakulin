import { passwordSchema } from '@/common';
import * as z from 'zod';
export const signInFormSchema = z.object({
  username: z.string(),
  password: passwordSchema,
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
