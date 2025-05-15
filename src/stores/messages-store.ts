import { type AxiosResponse, type AxiosError } from 'axios';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/boot/axios';
import { showErrors } from 'src/lib/helpers/show-errors';
import { type TResponse } from 'src/lib/types/network';
import { type TRequestLink, type TRequest } from './requests-store';

export type TMessage = {
  id: number;
  userName: string;
  userMessage: string;
  userMessageId: number;
  request: TRequest;
  link: TRequestLink;
};

export type TEditMessageDTO = {
  id: number;
};

export type TMessages = {
  page?: number;
  size?: number;
  list: TMessage[];
  allCount: number;
};

export const useMessagesStore = defineStore('messagesStore', {
  actions: {
    async editMessage(request: TEditMessageDTO): Promise<TResponse<TMessage>> {
      try {
        const data = await api.patch<
          TResponse<TMessage>,
          AxiosResponse<TResponse<TMessage>>,
          TEditMessageDTO
        >(`/message/${request.id}`, request);

        return data.data;
      } catch (e) {
        const error = e as AxiosError<TResponse>;
        showErrors(error.response?.data.message);
        return error?.response?.data || {};
      }
    },
    async getMessages(
      isWorkedOut: boolean,
      page: number | null,
      size: number | null,
    ): Promise<TResponse<TMessages>> {
      try {
        const data = await api.get<TResponse<TMessages>>('/message', {
          params: { page, size, isWorkedOut },
        });

        return data.data;
      } catch (e) {
        const error = e as AxiosError<TResponse>;
        showErrors(error.response?.data.message);
        return error?.response?.data || {};
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessagesStore, import.meta.hot));
}
