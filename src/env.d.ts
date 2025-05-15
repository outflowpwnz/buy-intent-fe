declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    BASE_URL: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
