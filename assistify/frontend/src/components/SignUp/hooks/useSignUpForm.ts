import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signUpFormSchema, SignUpFormSchema } from '../constants';

export const useSignUpForm = () => {
  return useForm<SignUpFormSchema>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
  });
};
