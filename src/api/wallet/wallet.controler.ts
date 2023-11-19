import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Delete,
  Patch,
  Request,
  UseInterceptors,
} from "@nestjs/common";
import { ApiKeyAuthGuard } from "@/guard";
import { WalletService } from "./wallet.service";
import { TransactionDto } from "@/dto";

import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiResponse,
} from "@nestjs/swagger";
import { ApiKeyInterceptor } from "@/interceptor";

@ApiTags("Wallet API")
@Controller("wallet-api")
@UseGuards(ApiKeyAuthGuard)
export class WalletApiController {
  constructor(private readonly walletService: WalletService) {}

  @Post("transaction")
  async createTransaction(
    @Body() transactions: TransactionDto[]
  ): Promise<void> {
    await this.walletService.processTransactions(transactions);
  }

  @UseInterceptors(ApiKeyInterceptor)
  @Get("customer/:id")
  async getCustomer(
    @Request() request: any,
    @Param("id") id: string
  ): Promise<any> {
    const apiKey = request.apiKey;
    const customer = await this.walletService.getCustomerDetails(id);
    if (apiKey) return customer;
    else
      return {
        first_name: customer.first_name,
        last_name: customer.last_name,
      };
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
