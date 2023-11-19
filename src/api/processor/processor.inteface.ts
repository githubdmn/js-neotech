import { TransactionDto } from '@/dto';

export interface IProcessor {
  processTransactions(transactions: TransactionDto[]): Promise<void>;
}
