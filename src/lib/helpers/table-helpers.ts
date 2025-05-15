import { type QTableProps } from 'quasar';

export const getBasePaginationProps = (
  isDisabled?: boolean,
): NonNullable<QTableProps['pagination']> | undefined =>
  isDisabled
    ? undefined
    : {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      };
