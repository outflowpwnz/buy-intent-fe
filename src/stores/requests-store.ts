import { type AxiosError, type AxiosResponse } from 'axios';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/boot/axios';
import { showErrors } from 'src/lib/helpers/show-errors';
import { type MakeOptional } from 'src/lib/types/helper-types';
import { type TResponse } from 'src/lib/types/network';

export type TRequestLink = {
  id: number;
  url: string;
};
export type TRequestContext = {
  id: number;
  value: string;
};

export enum ESocial {
  TELEGRAM = 'telegram',
}

export type TRequest = {
  id: number;
  name: string;
  links: TRequestLink[];
  contexts: TRequestContext[];
  social: ESocial;
};

export type TLinkOptionalId = MakeOptional<TRequestLink, 'id'>;

export type TContextOptionalId = MakeOptional<TRequestContext, 'id'>;

export type TRequests = {
  page: number;
  size: number;
  requests: TRequest[];
  allCount: number;
};

export type TGetRequestsResponse = {
  list: TRequest[];
};

export type TDeleteRequestsResponse = {
  isSuccess: boolean;
};

export type TAddRequestDTO = Omit<TRequest, 'id' | 'links' | 'contexts'> & {
  links: TLinkOptionalId[];
  contexts: TContextOptionalId[];
};
export type TEditRequestDTO = Omit<TRequest, 'links' | 'contexts'> & {
  links: TLinkOptionalId[];
  contexts: TContextOptionalId[];
};

export const useRequestsStore = defineStore('requestsStore', {
  actions: {
    async getRequest(id: number): Promise<TResponse<TRequest>> {
      try {
        const data = await api.get<TResponse<TRequest>>(`/request/${id}`);

        return data.data;
      } catch (e) {
        const error = e as AxiosError<TResponse>;
        showErrors(error.response?.data.message);
        return error?.response?.data || {};
      }
    },
    async addRequest(request: TAddRequestDTO): Promise<TResponse<{ id: number }>> {
      try {
        const data = await api.post<
          TResponse<number>,
          AxiosResponse<TResponse<{ id: number }>>,
          TAddRequestDTO
        >('/request', request);
        return data.data;
      } catch (e) {
        const error = e as AxiosError<TResponse>;
        showErrors(error.response?.data.message);
        return error?.response?.data || {};
      }
    },
    async editRequest(request: TEditRequestDTO): Promise<TResponse<TRequest>> {
      try {
        const data = await api.patch<
          TResponse<TRequest>,
          AxiosResponse<TResponse<TRequest>>,
          TEditRequestDTO
        >(`/request/${request.id}`, request);

        return data.data;
      } catch (e) {
        const error = e as AxiosError<TResponse>;
        showErrors(error.response?.data.message);
        return error?.response?.data || {};
      }
    },
    async deleteRequest(id: number): Promise<TResponse<TDeleteRequestsResponse>> {
      try {
        const data = await api.delete<TResponse<TDeleteRequestsResponse>>(`/request/${id}`);

        return data.data;
      } catch (e) {
        const error = e as AxiosError<TResponse>;
        showErrors(error.response?.data.message);
        return error?.response?.data || {};
      }
    },
    async getRequests(page: number, size: number): Promise<TResponse<TGetRequestsResponse>> {
      try {
        const data = await api.get<TResponse<TGetRequestsResponse>>('/request', {
          params: { page, size },
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
  import.meta.hot.accept(acceptHMRUpdate(useRequestsStore, import.meta.hot));
}
