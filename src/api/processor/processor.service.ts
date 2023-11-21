import { Injectable } from "@nestjs/common";
import { TransactionDto } from "@/dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Customer, CustomerDocument } from "../../models";
import { IProcessor } from "./processor.inteface";
import { MessagePattern } from "@nestjs/microservices";

@Injectable()
export class ProcessorService implements IProcessor {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>
  ) {}

  @MessagePattern({ cmd: "processTransactions" })
  async processTransactions(transactions: TransactionDto[]): Promise<void> {
    console.log(transactions);

    for (const transaction of transactions) {
      await this.processTransaction(transaction);
    }
  }

  private async processTransaction(transaction: TransactionDto): Promise<void> {
    console.log(transaction);

    const customer = await this.customerModel.findByIdAndUpdate(
      transaction.customerId,
      {
        $inc: { balance: -transaction.value },
      },
      { new: true }
    );

    console.log(customer);

    if (!customer || customer.balance < 0) {
      console.log(
        `customer ${transaction.customerId} does not have enough funds`
      );
    }
  }
}
