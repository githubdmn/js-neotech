import { Injectable, NotFoundException } from "@nestjs/common";
import { ProcessorService } from "@/api/processor/processor.service";
import { TransactionDto } from "@/dto";
import { InjectModel } from "@nestjs/mongoose";
import { Customer, CustomerDocument } from "@/models";
import { Document, Model } from "mongoose";

@Injectable()
export class WalletService {
  constructor(
    private readonly processorService: ProcessorService,
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>
  ) {}

  async processTransactions(transactions: TransactionDto[]): Promise<void> {
    const chunks = this.splitTransactionsIntoChunks(transactions);
    for (const chunk of chunks) {
      await this.processorService.processTransactions(chunk);
    }
  }

  splitTransactionsIntoChunks(
    transactions: TransactionDto[]
  ): TransactionDto[][] {
    const sortedTransactions = transactions.sort(
      (a, b) => b.value - a.value || a.latency - b.latency
    );

    const chunks: TransactionDto[][] = [];
    let currentChunk: TransactionDto[] = [];
    let currentLatency = 0;

    for (const transaction of sortedTransactions) {
      if (currentLatency + transaction.latency > 1000) {
        chunks.push(currentChunk);
        currentChunk = [transaction];
        currentLatency = transaction.latency;
      } else {
        currentChunk.push(transaction);
        currentLatency += transaction.latency;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  async getCustomerDetails(id: string): Promise<any> {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async deleteCustomer(id: string): Promise<any> {
    const result = await this.customerModel.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new NotFoundException(`Customer with ID ${id} not found`);
    else return result;
  }

  async updateCustomer(id: string, data: any): Promise<any> {
    const result = await this.customerModel.updateOne(
      { customerId: id },
      { $set: data }
    );
    if (result.modifiedCount === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }
}
