export type TResponse<T = object> = {
  error?: string;
  message?: string[];
} & Partial<T>;
