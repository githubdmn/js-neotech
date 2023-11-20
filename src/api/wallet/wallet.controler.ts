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
  HttpStatus,
  Res,
} from "@nestjs/common";
import e, { Response } from "express";
import { ApiKeyAuthGuard } from "@/guard";
import { WalletService } from "./wallet.service";
import {
  GetCustomerResponseDto,
  GetCustomerResponseUnauthorizedDto,
  TransactionDto,
  UpdateCustomerDTO,
} from "@/dto";

import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiHeader,
  ApiBody,
} from "@nestjs/swagger";
import { ApiKeyInterceptor } from "@/interceptor";

const API_KEY = "695315ba-0b60-45e4-b70a-2d52698f459c";

@ApiTags("Wallet API")
@Controller("wallet-api")
@UseGuards(ApiKeyAuthGuard)
export class WalletApiController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: "Send transactions to wallet api" })
  @ApiOkResponse({ description: "Successfully done" })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiHeader({
    name: "api-key",
    required: true,
    description: API_KEY,
  })
  @ApiBody({ isArray: true, required: true, type: TransactionDto })
  @Post("transaction")
  async createTransaction(
    @Body() transactions: TransactionDto[],
    @Res() res: Response
  ): Promise<void> {
    try {
      await this.walletService.processTransactions(transactions);
      res.status(HttpStatus.CREATED).send("Successfully done");
    } catch (e) {
      // TODO: error type check
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
    }
  }

  @ApiOperation({ summary: "Gets customer profile" })
  @ApiHeader({
    name: "api-key",
    required: false,
    description: API_KEY,
  })
  @ApiOkResponse({ description: "Successfully done" })
  @ApiResponse({ type: GetCustomerResponseDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: GetCustomerResponseUnauthorizedDto,
    status: HttpStatus.OK,
  })
  @UseInterceptors(ApiKeyInterceptor)
  @Get("customer/:id")
  async getCustomer(
    @Request() request: any,
    @Param("id") id: string
  ): Promise<GetCustomerResponseDto | GetCustomerResponseUnauthorizedDto> {
    const apiKey = request.apiKey;
    const customer = await this.walletService.getCustomerDetails(id);
    if (apiKey) return customer;
    else
      return {
        first_name: customer.first_name,
        last_name: customer.last_name,
      } as GetCustomerResponseUnauthorizedDto;
  }

  @ApiOperation({ summary: "Deletes customer profile" })
  @ApiHeader({
    name: "api-key",
    required: true,
    description: API_KEY,
  })
  @ApiResponse({ type: GetCustomerResponseDto, status: HttpStatus.OK })
  @Delete("customer/:id")
  async deleteCustomer(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const deleted = await this.walletService.deleteCustomer(id);
      res.status(HttpStatus.OK).send(deleted);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
    }
  }

  @ApiOperation({ summary: "Deletes customer profile" })
  @ApiHeader({
    name: "api-key",
    required: true,
    description: API_KEY,
  })
  @ApiResponse({ type: UpdateCustomerDTO, status: HttpStatus.OK })
  @Patch("customer/:id")
  async updateCustomer(
    @Param("id") id: string,
    @Body() data: UpdateCustomerDTO,
    @Res() res: Response
  ): Promise<void> {
    try {
      const updated = await this.walletService.updateCustomer(id, data);
      res.status(HttpStatus.CREATED).send(updated);
    } catch (e) {
      console.error("ERROR => ", e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
    }
  }
}
