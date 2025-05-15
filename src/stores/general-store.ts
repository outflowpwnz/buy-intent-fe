import { defineStore, acceptHMRUpdate } from 'pinia';

export const useGeneralStore = defineStore('generalStore', {
  state: () => ({
    isInitialLoading: true,
  }),

  actions: {
    setIsInitialLoading(payload: boolean) {
      this.isInitialLoading = payload;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneralStore, import.meta.hot));
}
