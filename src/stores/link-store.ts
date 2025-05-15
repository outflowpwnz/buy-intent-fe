import { type AxiosError } from 'axios';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/boot/axios';
import { showErrors } from 'src/lib/helpers/show-errors';
import { type TResponse } from 'src/lib/types/network';

export type TCheckChatExistDTO = {
  url: string;
};

export type TCheckChatExistResponse = {
  isChatExist: boolean;
};

export const useLinkStore = defineStore('linkStore', {
  state: () => ({}),

  actions: {
    async checkChatExist(dto: TCheckChatExistDTO): Promise<TResponse<TCheckChatExistResponse>> {
      try {
        const data = await api.get<TResponse<TCheckChatExistResponse>>('/link/check-chat-exist/', {
          params: { url: dto.url },
        });
        return data.data;
      } catch (e) {
        console.error(e);
        const error = e as AxiosError<TResponse<TCheckChatExistResponse>>;
        showErrors(error.response?.data.message);
        return error.response?.data || {};
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLinkStore, import.meta.hot));
}
