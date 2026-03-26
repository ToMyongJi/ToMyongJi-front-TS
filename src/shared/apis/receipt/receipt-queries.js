import { QK } from '@apis/base/key';
import { buildInfiniteQuery } from '@apis/base/factory';
import { receiptApi } from '@apis/receipt/receipt';
const pagePager = () => (lastPage) => lastPage.data.last ? null : lastPage.data.pageNumber + 1;
export const receiptQueries = {
    listInfinite: (clubId, year, month, size = 10, page = 0) => buildInfiniteQuery(QK.receipt.list(clubId, size, year, month, page), ({ pageParam }) => {
        const params = {
            page: pageParam !== null && pageParam !== void 0 ? pageParam : page,
            size,
        };
        if (year !== undefined)
            params.year = year;
        if (month !== undefined)
            params.month = month;
        return receiptApi.list(clubId, params);
    }, {
        initialPageParam: page,
        getNextPageParam: pagePager(),
    }),
};
