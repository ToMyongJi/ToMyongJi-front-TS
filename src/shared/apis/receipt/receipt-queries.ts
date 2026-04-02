import {QK} from '@apis/base/key';
import { buildInfiniteQuery, buildQuery } from '@apis/base/factory';
import {receiptApi} from '@apis/receipt/receipt';

type PageOf<T> = T extends (...args: infer _A) => infer R ? Awaited<R> : never;

const pagePager =
  <T extends { data: { pageNumber: number; last: boolean } }>() =>
    (lastPage: T): number | null =>
      lastPage.data.last ? null : lastPage.data.pageNumber + 1;

export const receiptQueries = {
  listInfinite: (clubId?: number, year?: number, month?: number, size = 10, page = 0) =>
    buildInfiniteQuery<
      PageOf<typeof receiptApi.list>,
      ReturnType<typeof QK.receipt.list>,
      number | null
    >(
      QK.receipt.list(clubId, size, year, month, page),
      ({ pageParam }) => {
        const params: { page: number; size: number; year?: number; month?: number } = {
          page: pageParam ?? page,
          size,
        };

        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;

        return receiptApi.list(clubId, params);
      },
      {
        initialPageParam: page,
        getNextPageParam: pagePager(),
      }
    ),
  club: (id?: number) => buildQuery(QK.receipt.club(id), () => receiptApi.club(id)),
  search: (keyword: string) => buildQuery(QK.receipt.search(keyword), () => receiptApi.search(keyword)),
};