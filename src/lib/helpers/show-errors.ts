import { Notify } from 'quasar';

export const showErrors = (errors?: string[] | string) => {
  if (errors) {
    const preparedErrors = typeof errors === 'string' ? [errors] : errors;

    preparedErrors?.forEach((error) => {
      Notify.create({ message: error, type: 'negative' });
    });
  }
};
