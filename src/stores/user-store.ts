import { type AxiosError, type AxiosResponse } from 'axios';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/boot/axios';
import { showErrors } from 'src/lib/helpers/show-errors';
import { type TResponse } from 'src/lib/types/network';

export type TUser = {
  email: string;
};

export type TLoginDTO = {
  email: string;
  password: string;
};

export type TRegisterDTO = {
  email: string;
  password: string;
  repeatPassword: string;
};

export type TLoginResponse = {
  id: number;
  token: string;
};

export type TRegisterResponse = {
  id: number;
  token: string;
};

export type TCheckAuthResponse = {
  isLoggedIn: boolean;
};

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isAuth: false,
  }),

  actions: {
    async checkAuth(): Promise<TResponse<TCheckAuthResponse>> {
      const token = localStorage.getItem('token');
      api.defaults.headers.common.Authorization = token;
      try {
        const data = await api.get<TResponse<TCheckAuthResponse>>('/auth/check-auth');
        this.isAuth = true;
        return data.data;
      } catch (e) {
        console.error(e);
        this.isAuth = false;
        const error = e as AxiosError<TResponse<TCheckAuthResponse>>;
        return error.response?.data || {};
      }
    },
    async login(loginDTO: TLoginDTO): Promise<TResponse<TLoginResponse>> {
      try {
        const data = await api.post<
          TResponse<boolean>,
          AxiosResponse<TResponse<TLoginResponse>>,
          TLoginDTO
        >('/auth/login', loginDTO);

        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
          api.defaults.headers.common.Authorization = data.data.token;
          this.isAuth = true;
        }
        return data.data;
      } catch (e) {
        const error = e as AxiosError<TResponse<TLoginResponse>>;
        showErrors(error.response?.data.message);
        return error?.response?.data || {};
      }
    },
    async register(registerDTO: TRegisterDTO): Promise<TResponse<TRegisterResponse>> {
      try {
        const data = await api.post<
          TResponse<boolean>,
          AxiosResponse<TResponse<TRegisterResponse>>,
          TRegisterDTO
        >('/auth/register', registerDTO);

        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
          api.defaults.headers.common.Authorization = data.data.token;
          this.isAuth = true;
        }

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
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
