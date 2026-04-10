import dayjs from 'dayjs';

type ReceiptLikeWithDate = {
  date: string | Date;
};

export type GroupedReceiptsByDate<T> = {
  date: string;
  receiptList: T[];
};

type ReceiptDtoPage<T> = {
  data?: {
    receiptDtoList?: T[];
  };
};

export const flattenReceiptDtoPages = <T>(pages: Array<ReceiptDtoPage<T>> | undefined): T[] =>
  pages?.reduce<T[]>((acc, page) => acc.concat(page.data?.receiptDtoList ?? []), []) ?? [];

export const groupReceiptsByDate = <T extends ReceiptLikeWithDate>(
  receipts: T[],
): GroupedReceiptsByDate<T>[] =>
  Array.from(
    receipts.reduce<Map<string, T[]>>((acc, receipt) => {
      const dateKey = dayjs(receipt.date).format('YYYY-MM-DD');
      const groupedReceipts = acc.get(dateKey);

      if (groupedReceipts != null) {
        groupedReceipts.push(receipt);
      } else {
        acc.set(dateKey, [receipt]);
      }

      return acc;
    }, new Map()),
    ([date, receiptList]) => ({ date, receiptList }),
  );
