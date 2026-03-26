import {receiptApi} from '@apis/receipt/receipt';
import { buildMutation } from '@apis/base/factory';

export const receiptMutations = {
  create: () => buildMutation(receiptApi.create),
  update: () => buildMutation(receiptApi.update),
  delete: () => buildMutation(receiptApi.delete),
};