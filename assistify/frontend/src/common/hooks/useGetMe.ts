import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';


export const useGetMe = () => {
  return useQuery({
    queryFn: api.getMe,
    queryKey: ['me'],
    select: ({ data }) => data,
  });
};
