import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Delete,
  Patch,
} from "@nestjs/common";
import { ApiKeyAuthGuard } from "@/guard";
import { WalletService } from "./wallet.service";
import { TransactionDto } from "@/dto";

@Controller("wallet-api")
// @UseGuards(ApiKeyAuthGuard)
export class WalletApiController {
  constructor(private readonly walletService: WalletService) {}

  @Post("transaction")
  async createTransaction(
    @Body() transactions: TransactionDto[]
  ): Promise<void> {
    await this.walletService.processTransactions(transactions);
  }

  @Get("customer/:id")
  async getCustomer(@Param("id") id: string): Promise<any> {
    return this.walletService.getCustomerDetails(id);
  }

  @Delete("customer/:id")
  async deleteCustomer(@Param("id") id: string): Promise<void> {
    return this.walletService.deleteCustomer(id);
  }

  @Patch("customer/:id")
  async updateCustomer(
    @Param("id") id: string,
    @Body() data: any
  ): Promise<void> {
    return this.walletService.updateCustomer(id, data);
  }
}
