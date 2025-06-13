import { fetchChatStream } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { Params, Settings } from 'react-chatbotify';

export const useChatStream = (settings : Settings) => {
  return useMutation({
    mutationFn: (params : Params) => fetchChatStream(params,settings)
  });
};
