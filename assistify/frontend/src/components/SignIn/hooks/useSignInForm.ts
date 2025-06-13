import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signInFormSchema, SignInFormSchema } from '../constants';

export const useSignInForm = () => {
  return useForm<SignInFormSchema>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(signInFormSchema),
  });
};
