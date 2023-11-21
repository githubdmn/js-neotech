import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProcessorService } from "../processor/processor.service";
import {
  GetCustomerResponseDto,
  TransactionDto,
  UpdateCustomerDTO,
} from "@/dto";
import { InjectModel } from "@nestjs/mongoose";
import { Customer, CustomerDocument } from "../../models";
import { Document, Model } from "mongoose";
import { Client, ClientProxy, Transport } from "@nestjs/microservices";

@Injectable()
export class WalletService {
  constructor(
    @Inject("PROCESSOR_SERVICE") private readonly processorService: ClientProxy,
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>
  ) {}

  async processTransactions(transactions: TransactionDto[]): Promise<void> {
    const pattern = { cmd: "processTransactions" };
    const chunks = this.splitTransactionsIntoChunks(transactions);
    for (const chunk of chunks) {
      console.log(chunk);
      await this.processorService
        .send<TransactionDto[]>(pattern, chunk)
        .toPromise();
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

  async getCustomerDetails(id: string): Promise<GetCustomerResponseDto> {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer as GetCustomerResponseDto;
  }

  async deleteCustomer(id: string): Promise<any> {
    const result = await this.customerModel.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new NotFoundException(`Customer with ID ${id} not found`);
    else return result;
  }

  async updateCustomer(
    id: string,
    data: Partial<UpdateCustomerDTO>
  ): Promise<any> {
    console.log(data);

    return await this.customerModel.findByIdAndUpdate(id, {
      $set: data,
    });
  }
}
