import { context } from '@/context';
import { useContext } from 'react';

export const useAuth = () => {
  const { auth, setAuth } = useContext(context);
  return { auth, setAuth };
};
